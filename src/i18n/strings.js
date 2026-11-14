export const strings={
  es:{start:'NUEVA PARTIDA',country:'ELEGIR PAÍS',observe:'OBSERVAR IA',settings:'AJUSTES',back:'VOLVER',play:'COMENZAR',
    menu:'MENÚ',military:'MILITAR',economy:'ECONOMÍA',diplomacy:'DIPLOMACIA',research:'INVESTIGACIÓN',ranking:'RANKING',
    charts:'GRÁFICAS',news:'NOTICIAS',editor:'EDITOR',replay:'REPETICIONES',profile:'PERFIL',tutorial:'TUTORIAL',
    pause:'PAUSA',resume:'REANUDAR',attack:'ATACAR',defend:'DEFENDER',recruit:'RECLUTAR',close:'CERRAR',
    loading:'INICIALIZANDO SIMULACIÓN',demo:'PROTOTIPO · MAPA FICTICIO',victory:'VICTORIA',day:'DÍA',treasury:'TESORO',population:'POBLACIÓN',
    noData:'Esta función llegará en una fase posterior.',selected:'SELECCIÓN',zoom:'PELLIZCA O USA LA RUEDA PARA ZOOM',
    audio:'SONIDO',language:'IDIOMA',quality:'CALIDAD',low:'BAJA',medium:'MEDIA',high:'ALTA'},
  en:{start:'NEW GAME',country:'CHOOSE COUNTRY',observe:'WATCH AI',settings:'SETTINGS',back:'BACK',play:'START',
    menu:'MENU',military:'MILITARY',economy:'ECONOMY',diplomacy:'DIPLOMACY',research:'RESEARCH',ranking:'RANKING',
    charts:'CHARTS',news:'NEWS',editor:'EDITOR',replay:'REPLAYS',profile:'PROFILE',tutorial:'TUTORIAL',
    pause:'PAUSE',resume:'RESUME',attack:'ATTACK',defend:'DEFEND',recruit:'RECRUIT',close:'CLOSE',
    loading:'INITIALIZING SIMULATION',demo:'PROTOTYPE · FICTIONAL MAP',victory:'VICTORY',day:'DAY',treasury:'TREASURY',population:'POPULATION',
    noData:'This feature arrives in a later phase.',selected:'SELECTED',zoom:'PINCH OR USE THE WHEEL TO ZOOM',
    audio:'SOUND',language:'LANGUAGE',quality:'QUALITY',low:'LOW',medium:'MEDIUM',high:'HIGH'}
};
export function t(lang,key){return strings[lang]?.[key]??strings.es[key]??key;}
