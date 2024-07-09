// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from "react";

const useWebSocket = (url: string) => {
	const socketRef = useRef<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const onOpen = () => {
			console.log("Connected to WebSocket");
			setIsConnected(true);
		};
		const onClose = () => {
			console.log("Disconnected from WebSocket");
			setIsConnected(false);
		};
		const onError = (error: Event) => {
			console.error("WebSocket error:", error);
			setIsConnected(false);
		};

		try {
			socketRef.current = new WebSocket(url);
			socketRef.current.addEventListener("open", onOpen);
			socketRef.current.addEventListener("close", onClose);
			socketRef.current.addEventListener("error", onError);
		} catch (error) {
			console.error("Failed to connect to WebSocket:", error);
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.removeEventListener("open", onOpen);
				socketRef.current.removeEventListener("close", onClose);
				socketRef.current.removeEventListener("error", onError);
				socketRef.current.close();
			}
		};
	}, [url]);

	const sendMessage = (message: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			if (
				!socketRef.current ||
				socketRef.current.readyState !== WebSocket.OPEN
			) {
				reject("WebSocket not connected or not open");
				return;
			}

			const onMessage = (event: MessageEvent) => {
				resolve(event.data);
			};

			socketRef.current.addEventListener("message", onMessage, { once: true });

			try {
				socketRef.current.send(message);
			} catch (error) {
				socketRef.current.removeEventListener("message", onMessage);
				reject("Failed to send message via WebSocket");
			}
		});
	};

	return { sendMessage, isConnected };
};

export default useWebSocket;
