# Kamin

Kamin은 카페 주문 경험과 온체인 리워드 시스템을 연결한 커피 포인트 dApp입니다.
사용자는 지갑을 연결한 뒤 브랜드와 메뉴를 선택하고, 백엔드에서 주문 정보를 생성한 다음, 스마트 컨트랙트에 주문을 확정하는 트랜잭션을 전송합니다. 주문이 성공하면 CafeMarket에 기록이 남고, 보상으로 KAMIN 토큰이 민팅됩니다.

프로젝트는 세 부분으로 구성됩니다.
- `frontend`: Next.js App Router 기반 사용자 인터페이스
- `backend`: NestJS, Prisma, PostgreSQL 기반 주문 API와 서명 생성 서버
- `contracts`: Foundry 기반 스마트 컨트랙트와 배포 스크립트

## Architecture

```mermaid
flowchart LR
    U[User]
    FE[Frontend<br/>Next.js + wagmi + RainbowKit]
    BE[Backend<br/>NestJS + Prisma]
    DB[(PostgreSQL)]

    subgraph CHAIN[Sepolia]
        K[Kamin Contract]
        M[CafeMarket Contracts<br/>Starbucks / Twosome / Mega / Hollys]
    end

    U -->|wallet connect / order request| FE
    FE -->|GET menus / history / grass / summary| BE
    BE -->|read / write| DB
    BE -->|orderId, rewardAmount, signature| FE
    FE -->|confirmOrder| K
    K -->|recordOrder| M
    K -->|mint KAMIN| U
```

## Order Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL
    participant K as Kamin
    participant M as CafeMarket

    U->>FE: 주문 요청
    FE->>BE: POST /order
    BE->>DB: 주문 저장
    BE-->>FE: orderId, rewardAmount, signature
    FE->>K: confirmOrder
    K->>M: recordOrder
    K-->>U: KAMIN mint
```
