## tsconfig

- target -> what version compile
- sourcemap : .map 파일의 생성여부
- outDir : 컴파일된 결과물이 위치할 폴더를 지정.
- include : 포함
- exclude : 포함x

- tsc 명령어 : ts파일의 코드를 컴파일해서 js파일과 js.map파일을 만들어 줍니다.

## typescript 기본

### ?

- ```
  const hi = (age,name?) => {
    console.log(age,name)
  }
  hi(24)
  ```
- name뒤에 ?를 붙여주면 name 은 optional하다는 의미입니다.
- name은 undefined로 찍히지만 실행은 가능 합니다.

### type

- ```
  const hi = (age:number,name:string):void => {
    console.log(age,name)
  }
  hi(24, "superman")
  ```
- 우리가 어떤 argument를 줘야할지 type을 정해줄수 있습니다.
- 리턴 type도 정해줄수있습니다.

### tsc-watch

- `"start": "tsc-watch --onSuccess \" node dist/index.js\" "`
- tsc-watch가 tsc가 성공하면 dist에있는 index.js를 node로 실행한다는 의미입니다.

## Interface

- ```
  interface Human {
    name: string;
    age: number;
    gender: string;
  }

  const person = {
    name: "nicolas",
    age: 22,
    gender: "male"
  };

  const sayHi = (person: Human): string => {
    return `Hello ${person.name}, you are ${person.age}, you are a ${person.gender}!`;
  };
  ```

- interface로 type을 설정해준다.
