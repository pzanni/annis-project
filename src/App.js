import './App.css';
import Plotly from 'plotly.js-dist'
import React, { useEffect, useState } from 'react';
import animals_for_meat from './data/animals-slaughtered-for-meat.csv';
import worldwide_meat_consumption from './data/meat_consumption_worldwide.csv';
import food_production_env_impact from './data/Food_Production.csv';
import { useFetchFile } from './fileFetchHook';

function App() {
  const selectedAnimal = useState('all'); // all, pig, birds, cow, sheep
  const [years, setYears] = useState([]);

  const food_env_impact = useFetchFile(food_production_env_impact);
  const meat_consumption = useFetchFile(worldwide_meat_consumption);
  const animals_killed = useFetchFile(animals_for_meat);

  useEffect(() => {
    gatherFoodEnvImpactData();
  }, [food_env_impact]);

  useEffect(() => {
    gatherMeatConsumptionData();
  }, [meat_consumption, animals_killed]);

  useEffect(() => {
    gatherAnimalKillData();
  }, [animals_killed, years]);

  const gatherAnimalKillData = () => {
    let titles = [];
    meat_consumption.forEach((row, index) => {
      if (!titles.includes(parseInt(row['TIME'])) && row['TIME'] <= 2018) {
        titles.push(parseInt(row['TIME']));
      };
    });

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

      animals_killed.forEach(row => {
        if (parseInt(row['Year']) === year) {
          total = total + (parseInt(row['Livestock Primary - Meat, cattle - 867 - Producing Animals/Slaughtered - 5320 - Head']) || 0);
          total = total + (parseInt(row['Livestock Primary - Meat, chicken - 1058 - Producing Animals/Slaughtered - 5321 - 1000 Head']) || 0);
          total = total + (parseInt(row['Livestock Primary - Meat, turkey - 1080 - Producing Animals/Slaughtered - 5321 - 1000 Head']) || 0);
          total = total + (parseInt(row['Livestock Primary - Meat, pig - 1035 - Producing Animals/Slaughtered - 5320 - Head']) || 0);
          total = total + (parseInt(row['Livestock Primary - Meat, sheep - 977 - Producing Animals/Slaughtered - 5320 - Head']) || 0);

          cows = cows + (parseInt(row['Livestock Primary - Meat, cattle - 867 - Producing Animals/Slaughtered - 5320 - Head']) || 0);
          birds = birds + (parseInt(row['Livestock Primary - Meat, chicken - 1058 - Producing Animals/Slaughtered - 5321 - 1000 Head']) || 0);
          birds = birds + (parseInt(row['Livestock Primary - Meat, turkey - 1080 - Producing Animals/Slaughtered - 5321 - 1000 Head']) || 0);
          pigs = pigs + (parseInt(row['Livestock Primary - Meat, pig - 1035 - Producing Animals/Slaughtered - 5320 - Head']) || 0);
          sheep = sheep + (parseInt(row['Livestock Primary - Meat, sheep - 977 - Producing Animals/Slaughtered - 5320 - Head']) || 0); 
        }
      });
      totalKilled[index] = total;
      cowsKilled[index] = cows;
      birdsKilled[index] = birds;
      sheepKilled[index] = sheep;
      pigsKilled[index] = pigs;
    });

    console.log(titles);
    console.log(totalKilled)

    const DIV = document.getElementById('animals_killed');

    let totalKillsTrace = {
      x: titles,
      y: totalKilled,
      name: 'Total killed animals'
    };

    var layout = {
      title: 'Animals slaughtered for meat',
      font: { size: 18 },
      yaxis: {
        title: {
          text: 'Number of animals',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };

    let data = [totalKillsTrace];
    Plotly.newPlot(DIV, data, layout);
  }

  const gatherMeatConsumptionData = () => {
    let titles = []; // years
    let values = [];
    let beefValues = [];
    let pigValues = [];
    let sheepValues = [];
    let poltryValues = [];

    meat_consumption.forEach((row, index) => {
      if (!titles.includes(parseInt(row['TIME']))) {
        titles.push(parseInt(row['TIME']));
      };
    });

    titles.sort();
    setYears(years);

    titles.forEach((year, index) => {
      let yearConsumption = 0;
      let beefConsumption = 0;
      let pigConsumption = 0;
      let sheepConsumption = 0;
      let poltryConsumption = 0;

      meat_consumption.forEach(row => {
        if (row['MEASURE'] === 'KG_CAP' && parseInt(row['TIME']) === year) {
          yearConsumption = yearConsumption + parseInt(row['Value']);
          if (row['SUBJECT'] === 'BEEF') {
            beefConsumption = beefConsumption + parseInt(row['Value']);
          } else if (row['SUBJECT'] === 'PIG') {
            pigConsumption = pigConsumption + parseInt(row['Value']);
          } else if (row['SUBJECT'] === 'SHEEP') {
            sheepConsumption = sheepConsumption + parseInt(row['Value']);
          } else if (row['SUBJECT'] === 'POULTRY') {
            poltryConsumption = poltryConsumption + parseInt(row['Value']);
          }
        }
      });
      values[index] = yearConsumption;
      beefValues[index] = beefConsumption;
      pigValues[index] = pigConsumption;
      sheepValues[index] = sheepConsumption;
      poltryValues[index] = poltryConsumption;
    });
    
    const DIV = document.getElementById('meat_consumption');

    let totalTrace = {
      x: titles,
      y: values,
      name: 'All animals'
    };

    let beefTrace = {
      x: titles,
      y: beefValues,
      name: 'Cows'
    };

    let pigTrace = {
      x: titles,
      y: pigValues,
      name: 'Pig'
    };

    let sheepTrace = {
      x: titles,
      y: sheepValues,
      name: 'Sheep'
    };

    let poltryTrace = {
      x: titles,
      y: poltryValues,
      name: 'Domestic birds'
    };

    var layout = {
      title: 'Worldwide Meat Consumption',
      font: { size: 18 },
      yaxis: {
        title: {
          text: 'Kg/capita',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };

    let data = [totalTrace, beefTrace, pigTrace, sheepTrace, poltryTrace];
    Plotly.newPlot(DIV, data, layout);
  }

  const gatherFoodEnvImpactData = () => {
    let titles = [];
    let values = [];

    food_env_impact.forEach(row => {
      titles.push(row['Food product']);
      values.push(row['Total_emissions']);
    });

    const DIV = document.getElementById('food_env_impact');
    var trace1 = {
      type: 'bar',
      x: titles,
      y: values,
      marker: {
        color: '#C8A2C8',
        line: {
          width: 2.5
        }
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Environment Impact of Food Production',
      font: { size: 18 }
    };

    var config = { responsive: true }
    Plotly.newPlot(DIV, data, layout, config);
  }

  return (
    <div className="App">
      <div id="food_env_impact" style={{ width: '1200px', height: '500px' }} />
      <div id="meat_consumption" style={{ width: '1200px', height: '500px' }} />
      <div id="animals_killed" style={{ width: '1200px', height: '500px' }} />
    </div>
  );
}

export default App;
