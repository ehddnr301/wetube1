## 3.9강

- `Property 'title' does not exist on type 'Document'.`
- video를 넘겨줘야하는데 type이 document라서 title이 없다고 한다.

- 해결 : `export interface IVideo extends mongoose.Document` 로 mongoose.Document를 확장해서 IVideo를 정의
- `const model = mongoose.model<IVideo & mongoose.Document>("Video", VideoSchema);` 로 IVideo와 mongoose.Document를 함께 type으로 이용

## typescript설정

- exModuleInterop
  - `Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'.`
  - allowSyntheticDefaultImports 를 암시적으로 허용해야한다.
  - default export 가 없으면 `import * as` 이런식으로 써주는게 맞지만 위 두옵션을 주면 그냥 import something from "somthing" 이 가능하다.

## User mode type

- user model type을 기존의 IUser로 했을때는 passport-local-mongoose의 기능을 사용하지 못하여서 수정합니다.
- mongoose.PassportLocalSchema 이 기본적으로 존재하여서 이것으로 변경하였습니다.

## github callback 에서 받아온 profile 사용

- <https://github.com/wan2land/stdjs/blob/3638ee0141aaeed571e0c7323bb2f37216ece267/packages/oauth/src/strategies/github.ts> 에서 발견.
- interface를 따로 만들어준다.

## kakao strategy

- `passport_kakao_1.default.Strategy is not a constructor` 에러가 나서 {Strategy} 를 passport-kakao 에서 import 하였습니다.

## changePassword

- `Property 'changePassword' does not exist on type 'User'` 에러가 발생
- `PassportLocalSchema` 에 changePassword가 있음에도 access 가 안되었음.
- `await req.user["changePassword"](oldPassword, newPassword);` 처럼 수정하니 access가 되었음.
- <https://stackoverflow.com/questions/36607979/how-to-get-around-property-does-not-exist-on-object/45090885>
- `If you don't want to change the type or create an interface, you can also use this syntax to access unknown properties:` 라고함

## upload video

- 이또한 위처럼 save나 id에 access 할수없어서 [] 를 사용하였습니다.

## webpack error

- `Module not found: Error: Can't resolve './videoPlayer' in '/Users/don/Documents/wetube/assets/ts'@ ./assets/ts/main.ts 4:0-24`
- resolve 해주지 못하는것으로 보여 webpack 설정에서 resolve를 추가해 주었습니다.

## Document

- `Property 'webkitExitFullscreen' does not exist on type 'Document'`
- document type 을 선언해도 되지만 any로 주었다.

## HTMLDivElement

- `Property 'webkitRequestFullscreen' does not exist on type 'HTMLDivElement'`
- 기존것을 Extend 하여 any로 처리

## video

- 전체화면을 하면 기존에 주었던 850px이 제일 나중에 적용되기때문에 width가 850px로 제한
- js에서 스타일을 주고 없애는 식으로 임시조치하였습니다.

## MediaRecorder

- `Cannot find name 'MediaRecorder'.`
- `yarn add @types/dom-mediacapture-record` 로 해결

## Comment interface 에 creator가 존재하지 않아 추가했습니다.

## Creator

- comment.creator 까지 밖에 안되었습니다.

```
const video = await Video.findById(id)
      .populate({
        model: "User",
        path: "creator"
      })
      .populate({
        path: "comments",
        populate: {
          model: "User",
          path: "creator"
        }
      });
```

- 라고 path랑 model을 적어주니 comment.creator.avatarUrl 까지 접근 가능!
