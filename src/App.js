import React, { useState, useEffect } from "react";
import "./App.css"
import iniciar from './assets/start.png';
import pausar from './assets/pausa.png';
import reiniciar from './assets/atualizar.png';
import alarme from "./assets/alarme.mp3";
import adicionar from "./assets/adicionar.png";
import diminuir from "./assets/diminuir.png";


const FOCUS = 0;
const INTERVAL = 1;
const LONGPAUSE= 2;
var interval;

function App() {
  const [initFocus, setInitFocus] = useState(25); //valores dos quadros
  const [initInterval, setInitInterval] = useState(5); //valores dos quadros
  const [initLongPause, setLongPause] = useState(10); //tempo da pausa longa por padrão
  const [timer, setTimer] = useState(25*60); //valores que serão modificados no cronometro
  const [status, setStatus] = useState(false);
  const [type, setType] = useState(FOCUS);
  const [session, setSession] = useState(1); //contagem das sessões
  const [statusLongPause, setStatusLongPause] = useState(false); //status se a pausa longa foi solicitada

  

  //funcao para reduzir tempo de foco pelo botao
  function reduceTimeFocus(){
    if(status){
      alert("É preciso pausar o cronômetro");
    }else if(initFocus <= 1){
      alert("O valor precisa ser maior que zero.")
    }else{
      setInitFocus((i) =>i-1);
      if(!status && type == FOCUS){
        setTimer((initFocus-1)*60);
      }
    }
  }

  //funcao para reduzir tempo de intervalo pelo botao
  function reduceTimeInterval(){
    if(status){
      alert("É preciso pausar o cronômetro");
    }else if(initInterval <= 1){
      alert("O valor precisa ser maior que zero.");
    }else{
      setInitInterval(initInterval-1);
      if(!status && type == INTERVAL){
        setTimer((initInterval-1)*60);
      }
    }
  }

  //funcao para adicionar tempo de foco pelo botao
  function addTimeFocus(){
    if(status){
      alert("É preciso pausar o cronômetro");
    }else{
      setInitFocus(initFocus+1);
      if(type === FOCUS){
        setTimer((initFocus+1)*60);
      }
    }
  }

  //funcao para adicionar tempo de intervalo pelo botao
  function addTimeInterval(){
    if(status){
      alert("É preciso pausar o cronômetro");
    }else{
      setInitInterval(initInterval+1);
      if(type === INTERVAL){
        setTimer((initInterval+1)*60);
      }
    }
  }

  /*Operações sobre o cronometro*/

  function startTimer(){ //ativa o cronometro
    console.log("startTimer");
    setStatus(true);
  }

  function pauseTimer(){ //pausa o cronometro
    console.log("pauseTime");
    clearInterval(interval);
    setStatus(false);
  }

  function restartTimer(){ //reinicia o cronometro
    clearInterval(interval);
    setStatus(false);
    if(type === FOCUS){
      setTimer(initFocus*60);
    }else if(type === INTERVAL){
      setTimer(initInterval*60);
    }else{
      setTimer(initLongPause*60);
    }
  }

  function resetTimer(){
    clearInterval(interval);
    setStatus(false);
    setType(FOCUS);
    setTimer(initFocus*60);
    setSession(1);
  }

  //funcoes para auxiliar na contagem do cronometro

  function decrementSeconds(){ //decrementa os segundos de tempo de foco
      setTimer((t) => Math.max(0, t-1));
  }

  //realiza as operações sobre o cronometro acompanhando os estados
  useEffect(() => {
    if(status){
      interval = setInterval(() => {
        decrementSeconds();
      }, 100);
    }else{
      clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    if(timer == 0){
      playAudio();
      setTimer((s) => s *60);
      if(type == FOCUS){
        if(statusLongPause && session % 4 == 0 && status){
          setType(LONGPAUSE);
          setTimer(initLongPause*60);
        }else{
          setType(INTERVAL);
          setTimer(initInterval*60);
        }
        
      }else{
        setType(FOCUS);
        setTimer(initFocus*60);
        setSession((s) => s + 1);
        
      }
    }
  }, [timer, session]);


  //preparando os segundos para mostrar na tela

  //converte segundos em minutos
  function getMinutes(seconds){
    return Math.floor(seconds/60);
  }

  //pega a parte dos segundos
  function getSeconds(seconds){
    return seconds%60;
  }

  //operações de pausa longa
  function activateLongPause(){
    setStatusLongPause((s) => !s);
  }

  //ativa audio
  function playAudio(){
    let audio = new Audio(alarme);
    audio.play();
    setTimeout(() => {
      audio.pause();
    }, 2000);
  }


  const minutes = getMinutes(timer);
  const seconds = getSeconds(timer);
  const screenMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const screenSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const screenTitle = type === FOCUS ? "Hora do foco!" : "INTERVALO!";
  const screnMessagePause = statusLongPause && session % 4 == 0 && type == LONGPAUSE ? "Pausa longa ativada!" : "";
  const screnMessagePause2 = statusLongPause ? "Desativar" : "Ativar";

  return(
    <div>
      
      <div className="cronometro">
        <div className="boxSession">
          <a className="session">{`Sessão: ${session}`}</a>
        </div>

        <div className="boxMenuTitle">
              <a className="menuTitle">{screenTitle}</a>
        </div>
        
        <div className="boxMessagePause">
          <span className="blink">{screnMessagePause}</span>
        </div>


        <div className="boxCronometro">
          <div className="menu">
            <a className="timer">{screenMinutes}:{screenSeconds}</a>
            <br></br>
            <button onClick={startTimer} className="button"><img src={iniciar} className="buttonImg"/></button>
            <button onClick={pauseTimer} className="button"><img src={pausar} className="buttonImg"/></button>
            <button onClick={restartTimer} className="button"><img src={reiniciar} className="buttonImg"/></button> <br></br><br></br><br></br>
            <button onClick={resetTimer} className="buttonReset"><a className="titleReset">Resetar cronômetro</a></button>
          </div>     
        </div>
        
      </div>

      <div className="container">
        <div className="boxConfig">
          <a className="titlePainel">Painel de configuração de tempo</a><br></br><br></br>
          <div className="">
            <a className="title">Tempo de foco</a>
          </div>
          <h1 className="initTime">{initFocus}</h1>
          <div className="buttonsInterval">
            <button className="button2" onClick={reduceTimeFocus}><img src={diminuir} className="buttonPainel"/></button>
            <button className="button2" onClick={addTimeFocus}><img src={adicionar} className="buttonPainel"/></button>
          </div>
        </div>

        <div className="boxConfig">
          <div className="">
            <a className="title">Tempo de intervalo</a>
          </div>
          <h1 className="initTime">{initInterval}</h1>
          <div className="buttonsInterval">
            <button className="button2" onClick={reduceTimeInterval}><img src={diminuir} className="buttonPainel"/></button>
            <button className="button2" onClick={addTimeInterval}><img src={adicionar} className="buttonPainel"/></button>
          </div>

          <div>
          <a className="title">Ativar pausa longa</a><br></br>
          <b className="titlePause">A cada 4ª sessão de intervalo terá 10 minutos de intervalo.</b>
          <br></br><br></br>
          <button className="buttonReset" onClick={activateLongPause}><a className="titleReset">{screnMessagePause2}</a></button>
        </div>
        </div>

        
      </div>

      
    </div>
  );
}

export default App;
