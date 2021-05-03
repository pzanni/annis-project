import "./App.css";
import Plotly from "plotly.js-dist";
import React, { useEffect, useState } from "react";
import animals_for_meat from "./data/animals-slaughtered-for-meat.csv";
import worldwide_meat_consumption from "./data/meat_consumption_worldwide.csv";
import food_production_env_impact from "./data/Food_Production.csv";
import { useFetchFile } from "./fileFetchHook";

function App() {
  const [selectedAnimal, setSelectedAnimal] = useState("all"); // all, pig, bird, cow, sheep
  const [years, setYears] = useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const food_env_impact = useFetchFile(food_production_env_impact);
  const meat_consumption = useFetchFile(worldwide_meat_consumption);
  const animals_killed = useFetchFile(animals_for_meat);

  const green = '#4a9d02';
  const red = '#dc143c';
  const pigColor = '#fa9c9b';
  const cowColor = '#545c58';
  const birdColor = '#faa008';
  const sheepColor = '#dadae4';

  useEffect(() => {
    gatherFoodEnvImpactData();
  }, [food_env_impact]);

  useEffect(() => {
    gatherMeatConsumptionData();
  }, [meat_consumption, animals_killed]);

  useEffect(() => {
    gatherAnimalKillData();
  }, [animals_killed, years]);

  const gatherAnimalKillData = (newAnimal) => {
    let titles = [];
    meat_consumption.forEach((row, index) => {
      if (!titles.includes(parseInt(row["TIME"])) && row["TIME"] <= 2018) {
        titles.push(parseInt(row["TIME"]));
      }
    });

    titles.pop(); //rm 1990

    let totalKilled = [];
    let cowsKilled = [];
    let birdsKilled = [];
    let pigsKilled = [];
    let sheepKilled = [];

    titles.forEach((year, index) => {
      let total = 0;
      let cows = 0;
      let birds = 0;
      let pigs = 0;
      let sheep = 0;

      animals_killed.forEach((row) => {
        if (parseInt(row["Year"]) === year) {
          total =
            total +
            (parseInt(
              row[
                "Livestock Primary - Meat, cattle - 867 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);
          total =
            total +
            (parseInt(
              row[
                "Livestock Primary - Meat, chicken - 1058 - Producing Animals/Slaughtered - 5321 - 1000 Head"
              ]
            ) || 0);
          total =
            total +
            (parseInt(
              row[
                "Livestock Primary - Meat, turkey - 1080 - Producing Animals/Slaughtered - 5321 - 1000 Head"
              ]
            ) || 0);
          total =
            total +
            (parseInt(
              row[
                "Livestock Primary - Meat, pig - 1035 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);
          total =
            total +
            (parseInt(
              row[
                "Livestock Primary - Meat, sheep - 977 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);

          cows =
            cows +
            (parseInt(
              row[
                "Livestock Primary - Meat, cattle - 867 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);
          birds =
            birds +
            (parseInt(
              row[
                "Livestock Primary - Meat, chicken - 1058 - Producing Animals/Slaughtered - 5321 - 1000 Head"
              ]
            ) || 0);
          birds =
            birds +
            (parseInt(
              row[
                "Livestock Primary - Meat, turkey - 1080 - Producing Animals/Slaughtered - 5321 - 1000 Head"
              ]
            ) || 0);
          pigs =
            pigs +
            (parseInt(
              row[
                "Livestock Primary - Meat, pig - 1035 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);
          sheep =
            sheep +
            (parseInt(
              row[
                "Livestock Primary - Meat, sheep - 977 - Producing Animals/Slaughtered - 5320 - Head"
              ]
            ) || 0);
        }
      });
      totalKilled[index] = total;
      cowsKilled[index] = cows;
      birdsKilled[index] = birds;
      sheepKilled[index] = sheep;
      pigsKilled[index] = pigs;
    });

    let totalKillsTrace = {
      x: titles,
      y: totalKilled,
      name: "All",
      marker: {
        color: red
      }
    };

    let cowsKilledTrace = {
      x: titles,
      y: cowsKilled,
      name: "Cows",
      marker: {
        color: cowColor
      }
    };

    let birdsKilledTrace = {
      x: titles,
      y: birdsKilled,
      name: "Birds",
      marker: {
        color: birdColor
      }
    };

    let pigsKilledTrace = {
      x: titles,
      y: pigsKilled,
      name: "Pigs",
      marker: {
        color: pigColor
      }
    };

    let sheepKilledTrace = {
      x: titles,
      y: sheepKilled,
      name: "Sheep",
      marker: {
        color: sheepColor
      }
    };

    const showTrace = (animal) => {
      const selected = newAnimal ? newAnimal : selectedAnimal;
      return selected === animal || selected === "all";
    };

    const data = [
      showTrace("all") ? totalKillsTrace : {},
      showTrace("cow") ? cowsKilledTrace : {},
      showTrace("bird") ? birdsKilledTrace : {},
      showTrace("pig") ? pigsKilledTrace : {},
      showTrace("sheep") ? sheepKilledTrace : {},
    ];

    plotAnimalsKilled(data);
  };

  const plotAnimalsKilled = (data) => {
    var layout = {
      title: "Animals slaughtered for meat",
      font: { size: 21, family: "'Chewy', cursive", },
      yaxis: {
        title: {
          text: "Number of animals",
          font: {
            family: "'Chewy', cursive",
            size: 18,
            color: "#7f7f7f",
          },
        },
      },
    };

    const DIV = document.getElementById("animals_killed");
    if (DIV) Plotly.newPlot(DIV, data, layout);
    forceUpdate();
  };

  const gatherMeatConsumptionData = (newAnimal) => {
    let titles = []; // years
    let values = [];
    let beefValues = [];
    let pigValues = [];
    let sheepValues = [];
    let poltryValues = [];

    meat_consumption.forEach((row, index) => {
      if (!titles.includes(parseInt(row["TIME"]))) {
        titles.push(parseInt(row["TIME"]));
      }
    });

    titles.sort();
    setYears(years);

    titles.forEach((year, index) => {
      let yearConsumption = 0;
      let beefConsumption = 0;
      let pigConsumption = 0;
      let sheepConsumption = 0;
      let poltryConsumption = 0;

      meat_consumption.forEach((row) => {
        if (row["MEASURE"] === "KG_CAP" && parseInt(row["TIME"]) === year) {
          yearConsumption = yearConsumption + parseInt(row["Value"]);
          if (row["SUBJECT"] === "BEEF") {
            beefConsumption = beefConsumption + parseInt(row["Value"]);
          } else if (row["SUBJECT"] === "PIG") {
            pigConsumption = pigConsumption + parseInt(row["Value"]);
          } else if (row["SUBJECT"] === "SHEEP") {
            sheepConsumption = sheepConsumption + parseInt(row["Value"]);
          } else if (row["SUBJECT"] === "POULTRY") {
            poltryConsumption = poltryConsumption + parseInt(row["Value"]);
          }
        }
      });
      values[index] = yearConsumption;
      beefValues[index] = beefConsumption;
      pigValues[index] = pigConsumption;
      sheepValues[index] = sheepConsumption;
      poltryValues[index] = poltryConsumption;
    });

    const DIV = document.getElementById("meat_consumption");

    let totalTrace = {
      x: titles,
      y: values,
      name: "All",
      marker: {
        color: red
      }
    };

    let beefTrace = {
      x: titles,
      y: beefValues,
      name: "Cows",
      marker: {
        color: cowColor
      }
    };

    let pigTrace = {
      x: titles,
      y: pigValues,
      name: "Pig",
      marker: {
        color: pigColor
      }
    };

    let sheepTrace = {
      x: titles,
      y: sheepValues,
      name: "Sheep",
      marker: {
        color: sheepColor
      }
    };

    let poltryTrace = {
      x: titles,
      y: poltryValues,
      name: "Birds",
      marker: {
        color: birdColor
      }
    };

    var layout = {
      title: "Worldwide Meat Consumption Kg/capita",
      font: { size: 21, family: "'Chewy', cursive", },
      yaxis: {
        title: {
          text: "Kg/capita",
          font: {
            family: "'Chewy', cursive",
            size: 18,
            color: "#7f7f7f",
          },
        },
      },
    };

    const showTrace = (animal) => {
      const selected = newAnimal ? newAnimal : selectedAnimal;
      return selected === animal || selected === "all";
    };

    let data = [
      showTrace("all") ? totalTrace : {},
      showTrace("cow") ? beefTrace : {},
      showTrace("pig") ? pigTrace : {},
      showTrace("bird") ? poltryTrace : {},
      showTrace("sheep") ? sheepTrace : {},
    ];
    if (DIV) Plotly.newPlot(DIV, data, layout);
    forceUpdate();
  };

  const gatherFoodEnvImpactData = (newAnimal) => {
    let titles = [];
    let values = [];
    const redTitles = [];
    const redValues = [];

    const veganFoodProducts = [
      "Wheat & Rye (Bread)",
      "Potatoes",
      "Nuts",
      "Soymilk",
      "Tofu",
    ];

    const filterAnimal = newAnimal || selectedAnimal;

    const animalFoodProducts = [
      filterAnimal === "cow" || filterAnimal === "all" ? "Beef (beef herd)" : "",
      filterAnimal === "cow" || filterAnimal === "all" ? "Beef (dairy herd)" : "",
      filterAnimal === "cow" || filterAnimal === "all" ? "Milk" : "",
      filterAnimal === "cow" || filterAnimal === "all" ? "Cheese" : "",
      filterAnimal === "sheep" || filterAnimal === "all" ? "Lamb & Mutton" : "",
      filterAnimal === "pig" || filterAnimal === "all" ? "Pig Meat" : "",
      filterAnimal === "bird" || filterAnimal === "all" ? "Eggs" : "",
      filterAnimal === "bird" || filterAnimal === "all" ? "Poultry Meat" : "",
    ];

    food_env_impact.forEach((row) => {
      console.log(row)
      if (veganFoodProducts.includes(row["Food product"])) {
        titles.push(row["Food product"]);
        values.push(row["Greenhouse gas emissions per 100g protein (kgCO₂eq per 100g protein)"]);
      } else if (animalFoodProducts.includes(row["Food product"])) {
        redTitles.push(row["Food product"]);
        redValues.push(row["Greenhouse gas emissions per 100g protein (kgCO₂eq per 100g protein)"]);
      }
    });

    const DIV = document.getElementById("food_env_impact");
    var trace1 = {
      type: "bar",
      x: titles,
      y: values,
      marker: {
        color: green,
      },
      name: 'Vegan foods'
    };

    var trace2 = {
      type: 'bar',
      x: redTitles,
      y: redValues,
      marker: {
        color: red,
      },
      name: 'Animal products'
    }

    var data = [trace1, trace2];

    var layout = {
      title: "Greenhouse gas emissions per 100g protein",
      font: { size: 21, family: "'Chewy', cursive", },
      yaxis: {
        title: {
          text: "kgCO₂eq per 100g protein",
          font: {
            family: "'Chewy', cursive",
            size: 18,
            color: "#7f7f7f",
          },
        },
      },
    };

    var config = { responsive: true };
    if (DIV) Plotly.newPlot(DIV, data, layout, config);
    forceUpdate();
  };

  const onChangeData = (newAnimal) => {
    setSelectedAnimal(newAnimal);
    gatherMeatConsumptionData(newAnimal);
    gatherAnimalKillData(newAnimal);
    gatherFoodEnvImpactData(newAnimal);
  };

  return (
    <div className="App">
      <div className="contents">
        <span className="page-title big-text">Cost of Food</span>
        <p className="selected-animal big-text">Select an animal</p>
        <div className="buttons-container">
          <div className="buttons">
            <div
              className={`animal-group ${
                selectedAnimal === "cow" && "selected"
              }`}
            >
              <button
                className={`animal-button cow ${
                  selectedAnimal == "cow" && "selected"
                }`}
                onClick={() => onChangeData("cow")}
              ></button>
              <label>Cow</label>
            </div>
            <div
              className={`animal-group ${
                selectedAnimal === "pig" && "selected"
              }`}
            >
              <button
                className={`animal-button pig ${
                  selectedAnimal == "pig" && "selected"
                }`}
                onClick={() => onChangeData("pig")}
              ></button>
              <label>Pig</label>
            </div>
            <div
              className={`animal-group ${
                selectedAnimal === "bird" && "selected"
              }`}
            >
              <button
                className={`animal-button chicken ${
                  selectedAnimal == "bird" && "selected"
                }`}
                onClick={() => onChangeData("bird")}
              ></button>
              <label>Birds</label>
            </div>
            <div
              className={`animal-group ${
                selectedAnimal === "sheep" && "selected"
              }`}
            >
              <button
                className={`animal-button sheep ${
                  selectedAnimal == "sheep" && "selected"
                }`}
                onClick={() => onChangeData("sheep")}
              ></button>
              <label>Sheep</label>
            </div>

            <button className="all-button" onClick={() => onChangeData("all")}>
              ALL
            </button>
          </div>
        </div>
        <div id="food_env_impact" className="plot plot-tall" />
        <div id="meat_consumption" className="plot plot-upper" />
        <div id="animals_killed" className="plot plot-lower" />
      </div>
      <div className="footer">
        <div>
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/surang" title="surang">
            surang
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <div>
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <a href="https://www.freepik.com/vectors/background">
          Background vector created by starline - www.freepik.com
        </a>
      </div>
    </div>
  );
}

export default App;
