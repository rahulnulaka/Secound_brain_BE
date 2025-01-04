export function createHash(length:number){
    let ans="";
    const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i=0;i<length;i++){
        ans+=characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return ans;
}