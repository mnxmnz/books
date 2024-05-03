---
sidebar_position: 36
---

# 아이템 36 해당 분야의 용어로 타입 이름 짓기

엄선된 타입, 속성, 변수의 이름은 의도를 명확히 하고 코드와 타입의 추상화 수준을 높여 준다. 잘못 선택한 타입 이름은 코드의 의도를 왜곡하고 잘못된 개념을 심어 주게 된다.

```ts
interface Animal {
  name: string;
  endangered: boolean;
  habitat: string;
}

const leopard: Animal = {
  name: 'Snow Leopard',
  endangered: false,
  habitat: 'tundra',
};
```

- name 이 일반적인 용어라서 동물의 학명인지 일반적인 명칭인지 알 수 없다.
- endangered 속성이 멸종 위기를 표현하기 위해 boolean 타입을 사용한 것이 이상하다. 이미 멸종된 동물을 true 로 해야 하는지 판단할 수 없다. endangered 속성의 의도를 ‘멸종 위기 또는 멸종’으로 생각한 것일지도 모른다.
- 서식지를 나타내는 habitat 속성은 너무 범위가 넓은 string 타입일 뿐만 아니라 서식지라는 뜻 자체도 불분명하기 때문에 다른 속성들보다도 훨씬 모호하다.
- 객체의 변수명이 leopard 이지만, name 속성의 값은 ‘Snow Leopard’이다. 객체의 이름과 속성의 name 이 다른 의도로 사용된 것인지 불분명하다.

```ts
interface Animal {
  commonName: string;
  genus: string;
  species: string;
  status: ConservationStatus;
  climates: KoppenClimate[];
}

type ConservationStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC';

type KoppenClimate =
  | 'Af'
  | 'Am'
  | 'As'
  | 'Aw'
  | 'BSh'
  | 'BSk'
  | 'BWh'
  | 'BWk'
  | 'Cfa'
  | 'Cfb'
  | 'Cfc'
  | 'Csa'
  | 'Csb'
  | 'Csc'
  | 'Cwa'
  | 'Cwb'
  | 'Cwc'
  | 'Dfa'
  | 'Dfb'
  | 'Dfc'
  | 'Dfd'
  | 'Dsa'
  | 'Dsb'
  | 'Dsc'
  | 'Dwa'
  | 'Dwb'
  | 'Dwc'
  | 'Dwd'
  | 'EF'
  | 'ET';

const snowLeopard: Animal = {
  commonName: 'Snow Leopard',
  genus: 'Panthera',
  species: 'Uncia',
  status: 'VU', // vulnerable
  climates: ['ET', 'EF', 'Dfd'],
};
```

- name 은 commonName, genus, species 등 더 구체적인 용어로 대체했다.
- endangered 는 동물 보호 등급에 대한 IUCN 의 표준 분류 체계인 ConservationStatus 타입의 status 로 변경되었다.
- habitat 은 기후를 뜻하는 climates 로 변경되었으며 쾨펜 기후 분류를 사용한다.

코드로 표현하고자 하는 모든 분야에는 주제를 설명하기 위한 전문 용어들이 있다. 자체적으로 용어를 만들어 내려고 하지 말고 해당 분야에 이미 존재하는 용어를 사용해야 한다. 이런 용어들은 오랜 시간에 걸쳐 다듬어져 왔으며 현장에서 실제로 사용되고 있을 것이다. 이런 용어들을 사용하면 사용자와 소통에 유리하며 타입의 명확성을 높일 수 있다.

전문 분야의 용어는 정확하게 사용해야 한다. 특정 용어를 다른 의미로 잘 못 쓰게 되면, 직접 만들어 낸 용어보다 더 혼란을 주게 된다.

타입, 속성, 변수에 이름을 붙일 때 명심해야 할 세 가지 규칙이 있다.

- 동일한 의미를 나타낼 때는 같은 용어를 사용해야 한다.
- 모호하고 의미없는 이름은 피해야 한다.
- 이름을 지을 때는 포함된 내용이나 계산 방식이 아니라 데이터 자체가 무엇인지를 고려해야 한다.

## 요약

- 가독성을 높이고 추상화 수준을 올리기 위해 해당 분야의 용어를 사용해야 한다.
- 같은 의미에 다른 이름을 붙이면 안 된다.
