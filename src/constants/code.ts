export const javascriptSample = `function add(a, b) {
  // enter your code here
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (line) {
  const [a, b] = line.split(' ').map(Number);
  console.log(add(a, b));
});`

export const pythonSample = `def add(a, b):
    # enter your code here

import sys

for line in sys.stdin:
    a, b = map(int, line.strip().split())
    print(add(a, b))
`

export const javaSample = `import java.util.Scanner;

public class Main {
    public static int add(int a, int b) {
        // enter your code here
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            System.out.println(add(a, b));
        }
        scanner.close();
    }
}
`

export const cSample = `#include <stdio.h>

int add(int a, int b) {
    // enter your code here
}

int main() {
    int a, b;
    while (scanf("%d %d", &a, &b) != EOF) {
        printf("%d\n", add(a, b));
    }
    return 0;
}
`

export const cppSample = `#include <iostream>
using namespace std;

int add(int a, int b) {
    // enter your code here
}

int main() {
    int a, b;
    while (cin >> a >> b) {
        cout << add(a, b) << endl;
    }
    return 0;
}
`
