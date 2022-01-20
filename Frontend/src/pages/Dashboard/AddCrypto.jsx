import React, { useState, useEffect } from 'react'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const AddCrypto = (props) => {
    const [queryedData, setQueryedData] = useState(props.allCryptos);

    return (
        <div>
        <React.Fragment>
                <div className="add-crypto div-active">
                    <ul className="inline-list select-list">
                        <h3 style={{color: 'white'}}>Select assets</h3>
                        <div className="h-spacer-choose-crypto"/>
                    {/*  <CloseRoundedIcon className="close-btn" sx={{color: 'white', fontSize: 32, cursor: 'pointer'}} 
                            onClick={() => props.setDialogOpen(false)}/> */}
                    </ul>
                    <ul className="search-list">
                       {/*  <SearchField queryData={queryData}/> */}
                        <ul className="search-list crypto-list">
                            {queryedData.map((item, val) => (
                                <ul key={val} className="crypto-list-item" onClick={() => {props.setLastSelectedCrypto(item); props.setTransactionPanelActive(true)}}>
                                    <img src={item.logo} width={30} alt="crypto logo"/>  
                                    <p>{item.name}</p>
                                    <p className="ticker">{item.ticker.toUpperCase()}</p>
                                    <div className="h-spacer-choose-crypto" />
                                    <ArrowForwardIosRoundedIcon sx={{color: 'white', marginRight: '5px'}}/>
                                </ul>
                            ))}
                        </ul>
                    </ul>
                </div>
            </React.Fragment>
        </div>
    )
};

export default AddCrypto;
