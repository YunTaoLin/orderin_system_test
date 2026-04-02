import type { BentoProductDayMenu } from "@/types";

export const bentoPrepaidAmount = 150;

export const bentoMenuMockData: BentoProductDayMenu[] = [
  {
    date: "02/02",
    weekday: "一",
    notice: "午餐：總部股東會，暫停供餐。 | 晚餐：總部股東會，暫停供餐。",
    periods: [],
  },
  {
    date: "02/03",
    weekday: "二",
    periods: [
      {
        key: "lunch",
        label: "午餐",
        items: [
          {
            id: "bento-001",
            name: "雞肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-002",
            name: "炸魚便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-003",
            name: "豬肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-004",
            name: "素食便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
        ],
      },
      {
        key: "dinner",
        label: "晚餐",
        items: [
          {
            id: "bento-001",
            name: "雞肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-002",
            name: "炸魚便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-003",
            name: "豬肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-004",
            name: "素食便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
        ],
      },
    ],
  },
  {
    date: "02/04",
    weekday: "三",
    periods: [
      {
        key: "lunch",
        label: "午餐",
        items: [
          {
            id: "bento-001",
            name: "雞肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-002",
            name: "炸魚便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-003",
            name: "豬肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-004",
            name: "素食便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
        ],
      },
      {
        key: "dinner",
        label: "晚餐",
        items: [
          {
            id: "bento-001",
            name: "雞肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-002",
            name: "炸魚便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-003",
            name: "豬肉便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
          {
            id: "bento-004",
            name: "素食便當",
            price: 30,
            img: "/assets/bento.jpg",
          },
        ],
      },
    ],
  },
  {
    date: "02/05",
    weekday: "四",
    notice: "尚未公布菜色。",
    periods: [],
  },
  {
    date: "02/06",
    weekday: "五",
    notice: "尚未公布菜色。",
    periods: [],
  },
];
