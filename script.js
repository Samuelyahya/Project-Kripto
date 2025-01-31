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

function findPossibleE(m) {
    const possibleE = [];
    for (let e = 2; e < m; e++) {
        if (gcd(e, m) === 1) {
            let d = 1;
            while ((d * e) % m !== 1 || d === e) {
                d++;

                if (d >= m) {
                    d = -1;
                    break;
                }
            }

            if (d !== -1) {
                possibleE.push(e);
                if (possibleE.length >= 10) {
                    break;
                }
            }
        }
    }
    return possibleE;
}

function splitNumber(num) {
    const Part1 = Math.floor(num / 10);
    const Part2 = num % 10;
    return [Part1, Part2]; 
}

function combineNumbers(first, second) {
    return first * 10 + second;
}

let publicKey = null;
let privateKey = null;

function generateKeys() {
    let p = parseInt(document.getElementById('p').value);
    let q = parseInt(document.getElementById('q').value);

    if (isNaN(p) || isNaN(q)) {
        alert("Masukan bilangan p dan q terlebih dahulu...");
        return;
    } 
    
    if (!isPrime(p) || !isPrime(q)) {
        alert('Kedua bilangan harus prima!');
        return;
    }
    
    if (p === q) {
        alert('Bilangan prima tidak boleh sama!');
        return;
    }
    
    let n = p * q;
    if (n <= 128) {
        alert("Pilih bilangan prima sehingga modulus lebih besar dari 128.");
        return;
    }
    
    let m = (p - 1) * (q - 1);
    let possibleE = findPossibleE(m);
    
    if (possibleE.length === 0) {
        alert('Tidak dapat menemukan nilai e yang valid. Silakan coba nilai p dan q yang berbeda.');
        return;
    }
    
    let eSelect = document.getElementById('e-select');
    eSelect.innerHTML = possibleE.map(e => 
        `<option value="${e}">${e}</option>`
    ).join('');
    
    document.getElementById('e-selection').style.display = 'block';
}

function finalizeKeys() {
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e-select').value);
    const n = p * q;
    const m = (p - 1) * (q - 1);
    
    let d = 1;
    while ((d * e) % m !== 1 || d === e) {
        d++;

        if (d >= m) {
            alert('Tidak dapat menemukan kunci private yang valid. Silakan pilih nilai e yang berbeda.');
            return;
        }
    }
    
    publicKey = { e, n };
    privateKey = { d, n };  
    
    document.getElementById('publicKey').innerHTML = `(${e}, ${n})`;
    document.getElementById('privateKey').innerHTML = `(${d}, ${n})`;
}

function encrypt() {
    
    const plaintext = document.getElementById('plaintext').value;
    const { e, n } = publicKey;
    
    try {
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
    } catch (error) {
        alert(error.message);
    }
}

function decrypt() {
    if (!privateKey) {
        alert('Harap hasilkan kunci terlebih dahulu');
        return;
    }
    
    const manualCipherText = document.getElementById('manual-cipher').value;
    const { d, n } = privateKey;
    
    try {
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
    } catch (error) {
        alert('Error saat mendekripsi: ' + error.message);
    }
}