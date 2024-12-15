function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }    
    }
    return true;
}

// Fungsi untuk menghitung FPB
function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Fungsi pangkat modulo untuk mengatasi bilangan besar
function modPow(base, exponent, modulus) {
    if (modulus === 1) {
        return 0;
    }
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

// Fungsi untuk menghasilkan kunci
function generateKeys() {
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);

    if (!isPrime(p) || !isPrime(q)) {
        alert('Kedua bilangan harus prima!');
        return;
    }

    const n = p * q;
    const m = (p - 1) * (q - 1);

    // Cari e
    let e = 2;
    while (e < m) {
        if (gcd(e, m) === 1) {
            break;
        }
        e++;
    }    

    // Cari d
    let d = 1;
    while ((d * e) % m !== 1) {
        d++;
    }

    publicKey = { e, n };
    privateKey = { d, n };

    document.getElementById('publicKey').innerHTML = `(${e}, ${n})`;

    document.getElementById('privateKey').innerHTML = `(${d}, ${n})`;
}

// Fungsi enkripsi
function encrypt() {
    if (!publicKey) {
        alert('Harap hasilkan kunci terlebih dahulu');
        return;
    }

    const plaintext = document.getElementById('plaintext').value;
    const { e, n } = publicKey;

    const encryptedText = plaintext
        .split('')
        .map(char => {
            const charCode = char.charCodeAt(0);
            return modPow(charCode, e, n);
        })
        .join(',');

    document.getElementById('encrypted-text').value = encryptedText;
}

// Fungsi dekripsi
function decrypt() {
    if (!privateKey) {
        alert('Harap hasilkan kunci terlebih dahulu');
        return;
    }

    const manualCipherText = document.getElementById('manual-cipher').value;
    const { d, n } = privateKey;

    const decryptedText = manualCipherText
        .split(',')
        .map(num => {
            const charCode = modPow(parseInt(num), d, n);
            return String.fromCharCode(charCode);
        })
        .join('');

    document.getElementById('decrypted-text').value = decryptedText;
}