import { ipURL } from "../utils/url";

export const GetIP = async () => {
    try {
        const resp = await fetch(`${ipURL}`);
        const json = await resp.json();
        console.log(json);
        return json;
    } catch (error) {
        console.log(error);
    }
};
