import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import Title from "./components/Title";
import fetchCat from "./components/fetchCat";
import MainCard from "./components/MainCard";
import Form from "./components/Form";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} />
      ))}
    </ul>
  );
}

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [catImg, catImgSet] = React.useState(CAT1);
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(catImg);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    catImgSet(newCat);
  }

  // useEffect
  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    catImgSet(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, catImg];
    setFavorites([...favorites, catImg]);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const catCountsText = counter === null ? "" : `${counter}번째`;

  return (
    <div>
      <Title>{catCountsText} 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={catImg}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
