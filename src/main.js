import { getData } from "./dataDownload";
import { menu } from "./menu.js";
async function main(){
    let data = await getData();
    console.log(data)
}

main()