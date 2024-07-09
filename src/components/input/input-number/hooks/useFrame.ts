import { useEffect, useRef } from "react";

let raf = (callback: FrameRequestCallback) => +setTimeout(callback, 16);
let caf = (num: number) => clearTimeout(num);

if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
	raf = (callback: FrameRequestCallback) =>
		window.requestAnimationFrame(callback);
	caf = (handle: number) => window.cancelAnimationFrame(handle);
}

let rafUUID = 0;
const rafIds = new Map<number, number>();

function cleanup(id: number) {
	rafIds.delete(id);
}

export function wrapperRaf(callback: () => void, times = 1): number {
	rafUUID += 1;
	const id = rafUUID;

	function callRef(leftTimes: number) {
		if (leftTimes === 0) {
			// Clean up
			cleanup(id);

			// Trigger
			callback();
		} else {
			// Next raf
			const realId = raf(() => {
				callRef(leftTimes - 1);
			});

			// Bind real raf id
			rafIds.set(id, realId);
		}
	}

	callRef(times);

	return id;
}

wrapperRaf.cancel = (id: number) => {
	const realId = rafIds.get(id);
	if (!realId) return;
	cleanup(realId);
	return caf(realId);
};

/**
 * Always trigger latest once when call multiple time
 */
export default () => {
	const idRef = useRef(0);

	const cleanUp = () => {
		wrapperRaf.cancel(idRef.current);
	};

	useEffect(() => cleanUp, []);

	return (callback: () => void) => {
		cleanUp();

		idRef.current = wrapperRaf(() => {
			callback();
		});
	};
};
