export async function fetchWrapper<T>(
	uri: string,
	config?: RequestInit,
): Promise<T> {
	const response = await fetch(uri, {
		...(config || {}),
	});
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || response.statusText);
	}
	const data = await response.json();
	return data?.data;
}
