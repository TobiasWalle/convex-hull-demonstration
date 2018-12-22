export class Stack<T> {
  private content: T[] = [];

  get length() {
    return this.content.length;
  }

  private get lastIndex() {
    return this.content.length - 1;
  }

  public push(v: T) {
    this.content.push(v);
  }

  public pop(): T {
    return this.content.splice(this.lastIndex, 1)[0];
  }

  public get top(): T {
    return this.content[this.lastIndex];
  }

  public get secondTop(): T {
    return this.content[this.lastIndex - 1];
  }

  public asArray() {
    return this.content;
  }
}
