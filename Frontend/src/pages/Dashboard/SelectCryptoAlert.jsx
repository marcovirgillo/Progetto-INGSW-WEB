import React, {useState, useEffect} from 'react';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

function SearchField(props) {
    return (
        <div className="search-field">
            <img className="search-icon-x" alt="search icon"
                src={require("../../res/logos/search.png")} width={18} height={18}/>
            <input className="search-container-x" type="text" placeholder="Search.." onChange={(ev) => props.queryData(ev.target.value)} />
        </div>
    );
}

const SelectCryptoAlert = (props) => {
    const [queryedData, setQueryedData] = useState(props.allCryptos);
    const [addAlertActive, setAddAlertActive] = useState(false);

    useEffect(() => {
        setQueryedData(props.allCryptos)
    }, [props.allCryptos]); 

    function selectCryptoAlertClass(){
        var name = "edit-alerts-div";
        if(props.selectCryptoActive){
            return name + " div-active";
        }
        return name;
    }

    const queryData = (str) => {
        let allCryptoCopy = [];
    
        props.allCryptos.forEach((item) => {
            if((item.name.toLowerCase()).includes(str.toLowerCase()) || (item.ticker.toLowerCase()).includes(str.toLowerCase()))
            allCryptoCopy.push(item);
        })
    
        setQueryedData(allCryptoCopy);
    }

    return (
        <React.Fragment>
            {props.selectCryptoActive && (<div className="background-blurrer-edit-alerts" />)}
          {/*   <AddAlert cryptoData=/> */}
            <div className={selectCryptoAlertClass()}>
                <ul className="inline-list select-list">
                    <span style={{color: 'white', fontSize:'20px', fontWeight:'700', paddingTop:'15px'}}>Select asset to create an allert</span>
                    <div className="h-spacer-choose-crypto"/>
                    <img src={require("../../res/logos/close.png")} width={24} height={24} alt="close select crypto alert" className="close-dashboard-icon"
                                            onClick={() => props.setSelectCryptoActive(false)}
                                        />
                </ul>
                <ul className="search-list">
                    <div style={{paddingTop:'30px'}} />
                    <SearchField queryData={queryData}/>
                    <ul className="search-list crypto-list">
                        {queryedData.map((item, val) => (
                            <ul key={val} className="crypto-list-item">
                                <img src={item.logo} width={30} alt="crypto logo"/>  
                                <p>{item.name}</p>
                                <p className="ticker">{item.ticker.toUpperCase()}</p>
                                <div className="h-spacer-choose-crypto" />
                                <ArrowForwardIosRoundedIcon  sx={{color: 'white',cursor: 'pointer'}}/>
                            </ul>
                        ))}
                    </ul>
                </ul>
            </div>
        </React.Fragment>
    );
};

export default SelectCryptoAlert;
