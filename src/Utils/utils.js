import data from '../data/EDAPlots-selectedparameters.json'
import factdata from '../data/FactSheet-selectedparameters.json'
import trenddata from '../data/Trendmap-selectedparameters.json'


export const getTrendParametersNames = () => {
    return new Promise((res, rej) => {
        const trendParameterNamesData = trenddata.map(({ParameterName}) => ParameterName);
        res([...new Set(trendParameterNamesData)]);
    });
}

export const getTrendPeriodNames = (parameterName) => {
    return new Promise((res, rej) => {
        let periodNames = trenddata.filter((record) => record.ParameterName === parameterName);
        periodNames = periodNames.map(({Period}) => Period);
        console.log(periodNames)
        res(periodNames);
    });
}

export const getTrendParameterCode = (periodName, parameterName) => {
    return new Promise((res, rej) => {
        let filteredRecords = trenddata.filter((record) => record.Period === periodName 
            && record.ParameterName === parameterName);
        console.log(filteredRecords)
        if(filteredRecords && filteredRecords.length > 0) {
            const [record, ...records] = filteredRecords;
            res([record.Parameter_Code, record.trend_record_code]);
        }
    });
}


export const getParametersNames = () => {
    return new Promise((res, rej) => {
        const parameterNamesData = data.map(({ParameterNames}) => ParameterNames);
        res([...new Set(parameterNamesData)]);
    });
}

export const getWaterParametersNames = () => {
    return new Promise((res, rej) => {
        const waterParameterNamesData = factdata.map(({ParameterName}) => ParameterName);
        res([...new Set(waterParameterNamesData)]);
    });
}

export const getParameterCode = (stationName, parameterName) => {
    return new Promise((res, rej) => {
        let filteredRecords = data.filter((record) => record.StationName === stationName 
            && record.ParameterNames === parameterName);
            console.log(filteredRecords)
        if(filteredRecords && filteredRecords.length > 0) {
            const [record, ...records] = filteredRecords;
            res([record.ParameterCode, record.record_code]);
        }
    });
}

export const getWaterParameterCode = (waterParameterName) => {
    return new Promise((res, rej) => {
        let filteredRecords = factdata.filter((record) => record.ParameterName === waterParameterName 
          );
            console.log(filteredRecords)
            if(filteredRecords && filteredRecords.length > 0) {
                const [record] = filteredRecords;
                res(record.Parameter_Code);
            }
        });
}

export const getStationNames = (parameterName) => {
    return new Promise((res, rej) => {
        let stationNames = data.filter((record) => record.ParameterNames === parameterName);
        stationNames = stationNames.map(({StationName}) => StationName);
        console.log(stationNames)
        res(stationNames);
    });
}

export const getRecordCode = (stationName, parameterCode) => {
    const bracketsRegex = /\(([^)]+)\)/;
    const bracketCode = bracketsRegex.exec(stationName)
    console.log(bracketCode[1]);
    return `${bracketCode[1]}00${parameterCode}`;
}
