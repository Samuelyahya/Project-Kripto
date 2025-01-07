function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function modPow(base, exponent, modulus) {
    if (modulus === 1) return 0;
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

let publicKey = null;
let privateKey = null;

function generateKeys() {
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    
    if (!isPrime(p) || !isPrime(q)) {
        alert('Kedua bilangan harus prima!');
        return;
    }
    
    const n = p * q;
    if (n <= 128) {
        alert("Pilih bilangan prima sehingga modulus lebih besar dari 128.");
        return;
    }
    
    const m = (p - 1) * (q - 1);
    
    let e = 2;
    while (e < m) {
        if (gcd(e, m) === 1) {
            break;
        }
        e++;
    }
    
    let d = 1;
    while ((d * e) % m !== 1) {
        d++;
    }
    
    publicKey = { e, n };
    privateKey = { d, n };  
    
    document.getElementById('publicKey').innerHTML = `(${e}, ${n})`;
    document.getElementById('privateKey').innerHTML = `(${d}, ${n})`;
}

function splitNumber(num) {
    const Part1 = Math.floor(num / 10);
    const Part2 = num % 10;
    return [Part1, Part2]; 
}

function combineNumbers(first, second) {
    return first * 10 + second;
}

function encrypt() {
    if (!publicKey) {
        alert('Harap hasilkan kunci terlebih dahulu');
        return;
    }
    
    const plaintext = document.getElementById('plaintext').value;
    const { e, n } = publicKey;
    
    const encryptedPairs = plaintext
        .split('')
        .map(char => {
            const charCode = char.charCodeAt(0);
            const [Part1, Part2] = splitNumber(charCode);
            
            const encryptedFirst = modPow(Part1, e, n);
            const encryptedSecond = modPow(Part2, e, n);
            
            return `${encryptedFirst}.${encryptedSecond}`;
        })
        .join(',');
    
    document.getElementById('encrypted-text').value = encryptedPairs;
}

function decrypt() {
    if (!privateKey) {
        alert('Harap hasilkan kunci terlebih dahulu');
        return;
    }
    
    const manualCipherText = document.getElementById('manual-cipher').value;
    const { d, n } = privateKey;
    
    const decryptedText = manualCipherText
        .split(',')
        .map(pair => {
            const [encFirst, encSecond] = pair.split('.');
            
            const decryptedFirst = modPow(parseInt(encFirst), d, n);
            const decryptedSecond = modPow(parseInt(encSecond), d, n);
            
            const charCode = combineNumbers(decryptedFirst, decryptedSecond);
            return String.fromCharCode(charCode);
        })
        .join('');
    
    document.getElementById('decrypted-text').value = decryptedText;
}