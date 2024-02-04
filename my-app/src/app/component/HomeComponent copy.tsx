"use client";
import React, { useEffect, useState } from "react";
import { promises as fs } from "fs";
import AsyncSelect from "react-select";
import opencage from "opencage-api-client";

const HomeComponent = ({ data }: any) => {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<any>();
  var options: any = [];
  JSON.parse(data).cities.map((item: any) => {
    return opencage
      .geocode({
        q: item.name,
        key: "da25757743ae4208a624d6c189142770",
      })
      .then((data) => {
        const city = fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat={${data.results[0].geometry.latitude}}&lon={${data.results[0].geometry.longitude}}&exclude={part}&appid={94201dede34eff68313b0849534f1517}`
        );
        options.push({ value: item.name, label: item.name, temperature: city });
      })
      .catch((error) => {
        console.log("error", error.message);
      });
  });

  return (
    <div>
      <div>
        {/* {dataWithCities.length != 0 &&
          dataWithCities.map((item: any) => {
            return <div key={item.name}>{item.name}</div>;
          })} */}
        <AsyncSelect
          value={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
      </div>
    </div>
  );
};

export default HomeComponent;
