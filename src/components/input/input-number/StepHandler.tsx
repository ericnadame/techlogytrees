import clsx from "clsx";
import * as React from "react";

/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;

/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;

export interface StepHandlerProps {
	onStep: (up: boolean) => void;
}

export default function StepHandler({ onStep }: StepHandlerProps) {
	// ======================== Step ========================
	const stepTimeoutRef = React.useRef<any>();

	const onStepRef = React.useRef<StepHandlerProps["onStep"]>();
	onStepRef.current = onStep;

	// We will interval update step when hold mouse down
	const onStepMouseDown = (e: React.MouseEvent, up: boolean) => {
		e.preventDefault();

		onStepRef?.current?.(up);

		// Loop step for interval
		function loopStep() {
			onStepRef?.current?.(up);

			stepTimeoutRef.current = setTimeout(loopStep, STEP_INTERVAL);
		}

		// First time press will wait some time to trigger loop step update
		stepTimeoutRef.current = setTimeout(loopStep, STEP_DELAY);
	};

	const onStopStep = () => {
		clearTimeout(stepTimeoutRef.current);
	};

	React.useEffect(() => onStopStep, []);

	const handlerClassName = `block overflow-hidden hover:bg-gray-100`;

	const sharedHandlerProps = {
		unselectable: "on" as const,
		role: "button",
		onMouseUp: onStopStep,
		onMouseLeave: onStopStep,
	};

	return (
		<div className="h-full w-5 border-l border-solid border-gray-300 transition-all duration-300">
			<span
				{...sharedHandlerProps}
				onMouseDown={(e) => {
					onStepMouseDown(e, true);
				}}
				aria-label="Increase Value"
				className={clsx(
					handlerClassName,
					`flex justify-center items-center lh-none pt-2 h-2/4 text-gray-400 rounded-tr border-b border-gray-300 border-solid transition-all duration-300 select-none`,
				)}
			>
				^
			</span>
			<span
				{...sharedHandlerProps}
				onMouseDown={(e) => {
					onStepMouseDown(e, false);
				}}
				aria-label="Decrease Value"
				className={clsx(
					handlerClassName,
					"flex justify-center items-center lh-none pt-1 h-2/4 text-gray-400 rounded-br transition-all duration-300 rotate-180 select-none",
				)}
			>
				^
			</span>
		</div>
	);
}
