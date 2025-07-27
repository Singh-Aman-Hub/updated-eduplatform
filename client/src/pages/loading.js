import React from 'react';
import './loading.css';

const Loading =()=>{
    return(
        <div className='load-container'>
            
            <div id="loader">

                <div id="back"></div>
                <div id="side"></div>
            </div>
            <div id='space'></div>
            <h2 align='center' >hey there, thanks for visting, re-activating the web-services! hold a sec...</h2>


            
        </div>
    )
}

export default Loading;