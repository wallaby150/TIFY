// import type { WishProps } from '../interface/interface';
import { useState } from 'react';
import '../../css/mypage/myFriend.styles.css';
import profileIcon from '../../assets/iconDefaultProfile.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function Friend() {
  let [wishes, setWishes] = useState([
    {
      title: '왈라비 주머니의 고영일 생일 위시',
      name: '기한',
      nickname: '기한짱짱맨',
    },
    {
      title: '왈라비 주머니의 고영일 생일 위시',
      name: '기한',
      nickname: '기한짱짱맨',
    },
  ]);
  console.log(wishes);

  return (
    <div id="base-div">
      <h1>Friend</h1>
      {/* <div className="ongoing-wishes">
        {wishes.map(function (wish) {
          return <WishCard wish={wish} />;
        })}
      </div> */}
      <div className="carousel-div">
        <Carousel></Carousel>
      </div>
    </div>
  );
}

// 캐러셀 부분
const Carousel = (items: any) => {
  // 옵션
  var items: any = [
    {
      img: '',
      name: '강기한1',
      nickname: '기한짱짱맨',
      title: 'Probably the most random thing you have ever seen!',
    },
    {
      img: '',
      name: '강기한2',
      nickname: '기한짱짱맨',
      title: 'Probably the most random thing you have ever seen!',
    },
    {
      img: '',
      name: '강기한3',
      nickname: '기한짱짱맨',
      title: 'Probably the most random thing you have ever seen!',
    },
    {
      img: '',
      name: '강기한4',
      nickname: '기한짱짱맨',
      title: 'Probably the most random thing you have ever seen!',
    },
  ];
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="ongoing-wishes">
      <h2> Responsive </h2>
      <Slider {...settings}>
        {items.map((item: any) => {
          return <WishCard item={item}></WishCard>;
        })}
        <div className="ongoing-wish">
          <h3>1</h3>
        </div>
        <div className="ongoing-wish">
          <h3>2</h3>
        </div>
        <div className="ongoing-wish">
          <h3>3</h3>
        </div>
        <div className="ongoing-wish">
          <h3>4</h3>
        </div>
        <div className="ongoing-wish">
          <h3>5</h3>
        </div>
        <div className="ongoing-wish">
          <h3>6</h3>
        </div>
        <div className="ongoing-wish">
          <h3>7</h3>
        </div>
        <div className="ongoing-wish">
          <h3>8</h3>
        </div>
      </Slider>
    </div>
  );
};

function WishCard({ item }: any) {
  return (
    <div className="ongoing-wish">
      <div className="profile-div">
        <img src={profileIcon} alt="" className="profile-img" />
        <div className="name-div">
          <p>{item.name}</p>
          <p>{item.nickname}</p>
        </div>
      </div>
      <p>{item.title}</p>
    </div>
  );
}
