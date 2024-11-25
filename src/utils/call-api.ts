import axios, { AxiosRequestConfig } from "axios";
import { TypeDataApis } from "@/enum/type-data-api.enum";
import { signOut } from "next-auth/react";

export async function callApi<T>({
	accessToken,
	type,
	body
}: {
	accessToken: string;
	type: TypeDataApis;
	body?: unknown
}): Promise<T> {
	try {
		const host = process.env.NEXT_PUBLIC_API_HOST + "/api/youtube"
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		};

		const requestBody = body ? { type, data: body, accessToken } : { type, accessToken };
		const response = await axios.post<T[]>(host, requestBody, config);
		return response.data as T;
	} catch (error) {
		console.log("API call error:", error);
		await signOut({
			callbackUrl: '/'
		})
		return [] as T
	}
}
