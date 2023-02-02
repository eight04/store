interface AnyA {
  foo(a: any): any;
  bar(): this;
}

export class A implements AnyA {
  #a: number;
  foo(a: number) {
    this.#a = a;
    console.log(this.#a);
  }
}

const o: AnyA = {
  foo(a) {
    return true;
  },
  bar() {
    return this;
  }
}

export class B implements AnyA {
  #a: string;
  foo(a: string) {
    this.#a = a;
    console.log("b", this.#a);
  }
}

const b: AnyA = new B;
console.log(b);
