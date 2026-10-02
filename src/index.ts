import { getUserData, updateUserData } from "../utils/db";

await updateUserData("1234567890", 0, 50);

console.log(await getUserData("1234567890"));
