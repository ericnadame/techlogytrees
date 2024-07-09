import * as React from "react";

import { InputHTMLAttributes, ReactNode, useEffect } from "react";

import StepHandler from "./StepHandler";
import useCursor from "./hooks/useCursor";
import useFrame from "./hooks/useFrame";
import useUpdateEffect from "./hooks/useUpdateEffect";

import getMiniDecimal, {
	DecimalClass,
	roundDownUnsignedDecimal,
	roundUpUnsignedDecimal,
	toFixed,
	ValueType,
} from "./utils/MiniDecimal";
import {
	getNumberPrecision,
	num2str,
	trimNumber,
	validateNumber,
} from "./utils/numberUtil";

import { LoadingOutlined } from "@/components/icons/LoadingOutlined";
import clsx from "clsx";

export const KeyCode = {
	ENTER: 13,
	UP: 38, // also NUM_NORTH
	DOWN: 40, // also NUM_SOUTH
};

export interface BaseInputProps<T>
	extends Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"value" | "defaultValue" | "onChange" | "className"
	> {
	value: T | undefined;
	onChange(value: T): void;
	loading?: boolean;
	isValid?: boolean;
	icon?: ReactNode;
	className?: string;
}

const getDecimalValue = (decimalValue: DecimalClass) => {
	if (decimalValue.isEmpty()) {
		return 0;
	}

	return decimalValue.toNumber();
};

const getDecimalIfValidate = (
	value: ValueType,
	precision: number | undefined,
	isMax?: boolean,
) => {
	const decimal = getMiniDecimal(value);
	if (decimal.isInvalidate()) {
		return null;
	}

	if (precision === undefined) {
		return decimal;
	}

	const { negative, integerStr, decimalStr, negativeStr } = trimNumber(
		decimal.toString(),
	);
	const unSignedNumberStr = `${integerStr}.${decimalStr}`;

	if ((isMax && !negative) || (!isMax && negative)) {
		return getMiniDecimal(
			negativeStr + roundDownUnsignedDecimal(unSignedNumberStr, precision),
		);
	} else {
		return getMiniDecimal(
			negativeStr + roundUpUnsignedDecimal(unSignedNumberStr, precision),
		);
	}
};

export interface InputNumberSpecificProps<T extends ValueType = number> {
	min?: T;
	max?: T;
	step?: T;
	keyboard?: boolean;

	/** Parse display value to validate number */
	parser?: (displayValue: string | undefined) => T;
	/** Transform `value` to display value show in input */
	formatter?: (
		value: T | undefined,
		info: { userTyping: boolean; input: string },
	) => string;

	/** Syntactic sugar of `formatter`. Config precision of display. */
	precision?: number;
	/** Syntactic sugar of `formatter`. Config decimal separator of display. */
	decimalSeparator?: string;
}

type InputNumberProps = BaseInputProps<number> & InputNumberSpecificProps;

export function InputNumber({
	value,
	onChange,
	isValid = true,
	loading,
	icon,
	className,
	tabIndex,
	min = Number.MIN_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	step = 1,
	disabled,
	keyboard,
	parser,
	formatter,
	precision,
	decimalSeparator,
	...inputProps
}: InputNumberProps) {
	const innerInputRef = React.useRef<HTMLInputElement>(null);

	const [focus, setFocus] = React.useState(false);

	const userTypingRef = React.useRef(false);
	const compositionRef = React.useRef(false);

	// ============================ Value =============================
	// Real value control
	const [decimalValue, setDecimalValue] = React.useState<DecimalClass>(() =>
		getMiniDecimal(value),
	);

	function setUncontrolledDecimalValue(newDecimal: DecimalClass) {
		if (value === undefined) {
			setDecimalValue(newDecimal);
		}
	}

	// ====================== Parser & Formatter ======================
	/**
	 * `precision` is used for formatter & onChange.
	 * It will auto generate by `value` & `step`.
	 * But it will not block user typing.
	 *
	 * Note: Auto generate `precision` is used for legacy logic.
	 * We should remove this since we already support high precision with BigInt.
	 *
	 * @param number  Provide which number should calculate precision
	 * @param userTyping  Change by user typing
	 */
	const getPrecision = React.useCallback(
		(numStr: string, userTyping: boolean) => {
			if (userTyping) {
				return undefined;
			}
			if (precision && precision >= 0) {
				return precision;
			}
			return Math.max(getNumberPrecision(numStr), getNumberPrecision(step));
		},
		[precision, step],
	);

	// >>> Parser
	const mergedParser = React.useCallback(
		(num: string | number) => {
			const numStr = String(num);

			if (parser) {
				return parser(numStr);
			}

			let parsedStr = numStr;
			if (decimalSeparator) {
				parsedStr = parsedStr.replace(decimalSeparator, ".");
			}

			// [Legacy] We still support auto convert `$ 123,456` to `123456`
			return parsedStr.replace(/[^\w.-]+/g, "");
		},
		[parser, decimalSeparator],
	);

	// >>> Formatter
	const inputValueRef = React.useRef<string | number | undefined>("");
	const mergedFormatter = React.useCallback(
		(number: string, userTyping: boolean) => {
			if (formatter) {
				return formatter(Number(number), {
					userTyping,
					input: String(inputValueRef.current),
				});
			}

			let str = typeof number === "number" ? num2str(number) : number;

			// User typing will not auto format with precision directly
			if (!userTyping) {
				const mergedPrecision = getPrecision(str, userTyping) || 0;
				if (validateNumber(str) && (decimalSeparator || mergedPrecision >= 0)) {
					// Separator
					const separatorStr = decimalSeparator || ".";

					str = toFixed(str, separatorStr, mergedPrecision);
				}
			}

			return str;
		},
		[formatter, getPrecision, decimalSeparator],
	);

	// ========================== InputValue ==========================
	/**
	 * Input text value control
	 *
	 * User can not update input content directly. It updates with following rules by priority:
	 *  1. controlled `value` changed
	 *    * [SPECIAL] Typing like `1.` should not immediately convert to `1`
	 *  2. User typing with format (not precision)
	 *  3. Blur or Enter trigger revalidate
	 */
	const [inputValue, setInternalInputValue] = React.useState<
		ValueType | undefined
	>(() => {
		const initValue = value;
		if (
			decimalValue.isInvalidate() &&
			["string", "number"].includes(typeof initValue)
		) {
			return Number.isNaN(initValue) ? "" : initValue;
		}
		return mergedFormatter(decimalValue.toString(), false);
	});
	inputValueRef.current = inputValue;

	// Should always be string
	function setInputValue(newValue: DecimalClass, userTyping: boolean) {
		setInternalInputValue(
			mergedFormatter(
				// Invalidate number is sometime passed by external control, we should let it go
				// Otherwise is controlled by internal interactive logic which check by userTyping
				// You can ref 'show limited value when input is not focused' test for more info.
				newValue.isInvalidate()
					? newValue.toString(false)
					: newValue.toString(!userTyping),
				userTyping,
			),
		);
	}

	// >>> Max & Min limit
	const maxDecimal = React.useMemo(
		() => getDecimalIfValidate(max, precision, true),
		[max, precision],
	);
	const minDecimal = React.useMemo(
		() => getDecimalIfValidate(min, precision, false),
		[min, precision],
	);

	// @ts-ignore
	const [recordCursor, restoreCursor] = useCursor(innerInputRef.current, focus);

	// ============================= Data =============================
	/**
	 * Find target value closet within range.
	 * e.g. [11, 28]:
	 *    3  => 11
	 *    23 => 23
	 *    99 => 28
	 */
	const getRangeValue = (target: DecimalClass) => {
		// target > max
		if (maxDecimal && !target.lessEquals(maxDecimal)) {
			return maxDecimal;
		}

		// target < min
		if (minDecimal && !minDecimal.lessEquals(target)) {
			return minDecimal;
		}

		return null;
	};

	/**
	 * Check value is in [min, max] range
	 */
	const isInRange = (target: DecimalClass) => !getRangeValue(target);

	/**
	 * Trigger `onChange` if value validated and not equals of origin.
	 * Return the value that re-align in range.
	 */
	const triggerValueUpdate = (
		newValue: DecimalClass,
		userTyping: boolean,
	): DecimalClass => {
		let updateValue = newValue;
		let isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();
		// Skip align value when trigger value is empty.
		// We just trigger onChange(null)
		// This should not block user typing
		if (!updateValue.isEmpty() && !userTyping) {
			// Revert value in range if needed
			updateValue = getRangeValue(updateValue) || updateValue;
			isRangeValidate = true;
		}

		if (!disabled && isRangeValidate) {
			const numStr = updateValue.toString();
			const mergedPrecision = getPrecision(numStr, userTyping);
			if (mergedPrecision && mergedPrecision >= 0) {
				updateValue = getMiniDecimal(toFixed(numStr, ".", mergedPrecision));
			}
			// Trigger event
			if (!updateValue.equals(decimalValue)) {
				setUncontrolledDecimalValue(updateValue);
				onChange?.(updateValue.isEmpty() ? 0 : getDecimalValue(updateValue));

				// Reformat input if value is not controlled
				if (value === undefined) {
					setInputValue(updateValue, userTyping);
				}
			}

			return updateValue;
		}

		return decimalValue;
	};

	// ========================== User Input ==========================
	const onNextPromise = useFrame();

	// >>> Collect input value
	const collectInputValue = (inputStr: string) => {
		recordCursor();

		// Update inputValue in case input can not parse as number
		setInternalInputValue(inputStr);

		// Parse number
		if (!compositionRef.current) {
			const finalValue = mergedParser(inputStr);
			const finalDecimal = getMiniDecimal(finalValue);
			if (!finalDecimal.isNaN()) {
				triggerValueUpdate(finalDecimal, true);
			}
		}

		// optimize for chinese input experience
		// https://github.com/ant-design/ant-design/issues/8196
		onNextPromise(() => {
			let nextInputStr = inputStr;
			if (!parser) {
				nextInputStr = inputStr.replace(/。/g, ".");
			}

			if (nextInputStr !== inputStr) {
				collectInputValue(nextInputStr);
			}
		});
	};

	// >>> Composition
	const onCompositionStart = () => {
		compositionRef.current = true;
	};

	const onCompositionEnd = () => {
		compositionRef.current = false;

		collectInputValue(innerInputRef?.current?.value || "");
	};

	// >>> Input
	const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		collectInputValue(e.target.value);
	};

	// ============================= Step =============================
	const onInternalStep = (up: boolean) => {
		userTypingRef.current = false;

		let stepDecimal = getMiniDecimal(step);
		if (!up) {
			stepDecimal = stepDecimal.negate();
		}

		const target = (decimalValue || getMiniDecimal(0)).add(
			stepDecimal.toString(),
		);
		triggerValueUpdate(target, false);

		innerInputRef.current?.focus();
	};

	// ============================ Flush =============================
	/**
	 * Flush current input content to trigger value change & re-formatter input if needed
	 */
	const flushInputValue = (userTyping: boolean) => {
		const parsedValue = getMiniDecimal(mergedParser(inputValue || 0));
		let formatValue: DecimalClass = parsedValue;

		if (!parsedValue.isNaN()) {
			// Only validate value or empty value can be re-fill to inputValue
			// Reassign the formatValue within ranged of trigger control
			formatValue = triggerValueUpdate(parsedValue, userTyping);
		} else {
			formatValue = decimalValue;
		}

		if (value !== undefined) {
			// Reset back with controlled value first
			setInputValue(decimalValue, false);
		} else if (!formatValue.isNaN()) {
			// Reset input back since no validate value
			setInputValue(formatValue, false);
		}
	};

	const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
		const { which } = event;
		userTypingRef.current = true;

		if (which === KeyCode.ENTER) {
			if (!compositionRef.current) {
				userTypingRef.current = false;
			}
			flushInputValue(false);
		}

		if (keyboard === false) {
			return;
		}

		// Do step
		if (!compositionRef.current && [KeyCode.UP, KeyCode.DOWN].includes(which)) {
			onInternalStep(KeyCode.UP === which);
			event.preventDefault();
		}
	};

	const onKeyUp = () => {
		userTypingRef.current = false;
	};

	// >>> Focus & Blur
	const onBlur = () => {
		flushInputValue(false);

		setFocus(false);

		userTypingRef.current = false;
	};

	function handleFocus(): void {
		setFocus(true);
	}

	// ========================== Controlled ==========================
	// Input by precision
	useUpdateEffect(() => {
		if (!decimalValue.isInvalidate()) {
			setInputValue(decimalValue, false);
		}
	}, [precision]);

	// Input by value
	useUpdateEffect(() => {
		const newValue = getMiniDecimal(value);
		setDecimalValue(newValue);

		const currentParsedValue = getMiniDecimal(mergedParser(inputValue || 0));
		// When user typing from `1.2` to `1.`, we should not convert to `1` immediately.
		// But let it go if user set `formatter`
		if (
			!newValue.equals(currentParsedValue) ||
			!userTypingRef.current ||
			formatter
		) {
			// Update value as effect
			setInputValue(newValue, userTypingRef.current);
		}
	}, [value]);

	// ============================ Cursor ============================
	useUpdateEffect(() => {
		if (formatter) {
			restoreCursor();
		}
	}, [inputValue]);

	// ============================ IsValid =============================

	const [inputIsValid, setInputIsValid] = React.useState(isInputValid());

	function isInputValid(): boolean {
		return !(
			(!decimalValue.isInvalidate() && !isInRange(decimalValue)) ||
			decimalValue.isNaN() ||
			!isValid
		);
	}

	useEffect(() => {
		setInputIsValid(isInputValid());
	}, [isValid, value, decimalValue]);

	// ============================ Render ============================
	return (
		<div
			className={clsx(
				"flex p-0 m-0 h-11 align-middle rounded border border-gray-300 border-solid shadow-none transition-all duration-300 leading-11",
				{
					"ring-1": focus,
					"hover:border-blue-300 hover:shadow-blue-300": !focus && inputIsValid,
					"border-blue-300 shadow-blue-300": focus && inputIsValid,
					"border-red-300 hover:shadow-red-300": !focus && !inputIsValid,
					"border-red-300 ring-red-300 shadow-red-300": focus && !inputIsValid,
					"bg-gray-100 hover:!border-gray-300 hover:!shadow-none opacity-70":
						disabled,
				},
			)}
			onFocus={handleFocus}
			onBlur={onBlur}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			onCompositionStart={onCompositionStart}
			onCompositionEnd={onCompositionEnd}
		>
			{icon && (
				<span className="flex h-full w-11 items-center pl-3">{icon}</span>
			)}
			<input
				value={inputValue}
				onChange={onInternalInput}
				tabIndex={tabIndex}
				className={clsx(
					"p-0 px-3 w-full h-full text-gray-600 rounded border-0 outline-none transition-all duration-300 ease-in leading-11",
					{ "cursor-not-allowed": disabled },

					className,
				)}
				disabled={disabled}
				autoComplete="off"
				step={step}
				role="number"
				aria-valuemin={min as any}
				aria-valuemax={max as any}
				aria-valuenow={
					decimalValue.isInvalidate() ? null : (decimalValue.toString() as any)
				}
				{...inputProps}
			/>
			<span className="flex h-full items-center">
				{loading && <LoadingOutlined className="mr-4 h-full" />}
				<StepHandler onStep={onInternalStep} />
			</span>
		</div>
	);
}
