"use client";
import React, { useEffect, useState } from "react";
import { promises as fs } from "fs";
import AsyncSelect from "react-select";
import opencage from "opencage-api-client";

const HomeComponent = ({ data }: any) => {
  const [allList, setAllList] = useState<any>(JSON.parse(data));
  const [allListCities, setAllListCities] = useState<any>(
    JSON.parse(data).cities
  );

  const [cityData, setCityData] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [selectedCountry, setSelectedCountry] = useState<any>();
  const [removeCity, setRemoveCity] = useState<any>();
  const [addCity, setAddCity] = useState<any>();
  const [addNewCity, setAddNewCity] = useState<any>(false);
  const [removeCityDatabase, setRemoveCityDatabase] = useState<any>(false);

  useEffect(() => {
    if (selectedOption != undefined) {
      opencage
        .geocode({
          q: selectedOption.value,
          key: "5cf55afcd1894f5196581367774f5e01",
        })
        .then((data) => {
          console.log(
            data.results[0].geometry,
            "data.results[0].geometry.latitude"
          );
          const city = fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${data.results[0].geometry.lat}&lon=${data.results[0].geometry.lng}&units=metric&appid=071afcd8ecc9b53368e8d9b870d5fd21`
          )
            .then((res) => res.json())
            .then((data) => setCityData(data.main));
        })
        .catch((error) => {
          console.log("error", error.message);
        });
    }
  }, [selectedOption]);

  const options: any = allListCities.map((item: any) => {
    return { value: item.name, label: item.name };
  });
  const optionsCountries = allList.countries.map((item: any) => {
    return { value: item, label: item };
  });

  const deleteCityFromList = () => {
    return setAllListCities(
      allListCities.filter(
        (item: { name: any }) => item.name != removeCity.label
      )
    );
  };

  const addCityInList = () => {
    setAllListCities([
      ...allListCities,
      { name: addCity, country: selectedCountry.value },
    ]);
  };

  return (
    <div>
      <div>
        <div>Select city: </div>
        <AsyncSelect
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        {cityData != undefined && (
          <div>
            <div>Temperature: {cityData.temp}</div>
            <div>Feels like: {cityData.feels_like}</div>
            <div>Temperature max: {cityData.temp_max}</div>
            <div>Temperature min: {cityData.temp_min}</div>
          </div>
        )}
        <div onClick={() => setAddNewCity(!addNewCity)}>Add new city</div>
        {addNewCity && (
          <form
            onSubmit={(e) => {
              e.preventDefault(), addCityInList();
            }}
          >
            <div>Select country from the list</div>
            <AsyncSelect
              value={selectedCountry}
              onChange={setSelectedCountry}
              options={optionsCountries}
            />
            <div>City name</div>
            <input onChange={(e) => setAddCity(e.target.value)} type="text" />
            <button type="submit">Add</button>
          </form>
        )}
        <div onClick={() => setRemoveCityDatabase(!removeCityDatabase)}>
          Remove city
        </div>
        {removeCityDatabase && (
          <form
            onSubmit={(e) => {
              e.preventDefault(), deleteCityFromList();
            }}
          >
            <AsyncSelect
              value={removeCity}
              onChange={setRemoveCity}
              options={options}
            />
            <button type="submit">Delete</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeComponent;
