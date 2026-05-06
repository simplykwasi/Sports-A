export function poissonP(k, lambda) {
  if (k < 0) return 0;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
}

function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}
