
function sumEventDigits(num) {
    let sum = 0;
    while (num > 0) {
        let lastNum = num % 10;
        if (lastNum % 2 === 0) {
            sum += lastNum;
        }
        num = Math.floor(num / 10);
    }
    return sum;
}
const num = 1234567;
const result = sumEventDigits(num);
console.log(`result = ${result}`); // Output: result = 12

