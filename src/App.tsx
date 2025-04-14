import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Globe, AlertCircle, ArrowUpDown, Activity, Calendar, Info, Bell, LineChart, Settings, Volume2, Eye, EyeOff, Calendar as CalendarIcon, Zap, DollarSign } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

function App() {
  const [parisTime, setParisTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState({
    frankfurt: false,
    london: false,
    newyork: false,
    tokyo: false
  });

  const [showAlert, setShowAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hiddenPairs, setHiddenPairs] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activePairs, setActivePairs] = useState<Array<{pair: string, activity: number}>>([]);
  const [spreads, setSpreads] = useState<Record<string, number>>({});
  
  // Événements économiques à venir
  const upcomingEvents = [
    {
      date: addDays(new Date(), 2),
      time: '14:30',
      title: 'Publication PIB Zone Euro',
      impact: 'Élevé'
    },
    {
      date: addDays(new Date(), 3),
      time: '10:00',
      title: 'Décision taux BCE',
      impact: 'Très Élevé'
    },
    {
      date: addDays(new Date(), 5),
      time: '08:30',
      title: 'PMI Services France',
      impact: 'Moyen'
    }
  ];

  // Simulation de l'activité des paires et des spreads
  useEffect(() => {
    const updateActivePairs = () => {
      const pairs = ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'EUR/JPY', 'USD/JPY'];
      const newActivePairs = pairs.map(pair => ({
        pair,
        activity: Math.random() * 100
      })).sort((a, b) => b.activity - a.activity);
      setActivePairs(newActivePairs);

      // Mise à jour des spreads
      const newSpreads: Record<string, number> = {};
      pairs.forEach(pair => {
        const baseSpread = pair === 'EUR/JPY' ? 0.02 : 0.0001;
        const variation = (Math.random() - 0.5) * baseSpread * 0.2;
        newSpreads[pair] = +(baseSpread + variation).toFixed(5);
      });
      setSpreads(newSpreads);
    };

    const activityTimer = setInterval(updateActivePairs, 5000);
    updateActivePairs(); // Initial update

    return () => clearInterval(activityTimer);
  }, []);

  // Mise à jour de l'heure et vérification des événements
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setParisTime(now);
      
      // Mise à jour des statuts des marchés
      const hour = now.getHours();
      const newMarketStatus = {
        frankfurt: hour >= 8 && hour < 16.5,
        london: hour >= 8 && hour < 16.5,
        newyork: hour >= 14.5 && hour < 21,
        tokyo: hour >= 0 && hour < 8
      };

      setMarketStatus(newMarketStatus);

      // Vérification des événements du jour
      const todayEvents = upcomingEvents.filter(event => 
        isSameDay(event.date, now)
      );

      todayEvents.forEach(event => {
        const [eventHour, eventMinute] = event.time.split(':').map(Number);
        if (hour === eventHour && now.getMinutes() === eventMinute) {
          const notification = `${event.title} - Impact: ${event.impact}`;
          setNotifications(prev => [...prev, notification]);
          if (soundEnabled) {
            playAlertSound();
          }
        }
      });

      // Alerte de changement de session
      if (hour === 8 || hour === 14 || hour === 0) {
        setShowAlert(true);
        if (soundEnabled) {
          playAlertSound();
        }
        setTimeout(() => setShowAlert(false), 5000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [soundEnabled]);

  const playAlertSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(console.error);
  };

  // Formatter l'heure de Paris
  const parisTimeString = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(parisTime);

  // Déterminer si le marché de Paris est ouvert (9h-17h30)
  const parisHour = parisTime.getHours();
  const isParisMarketOpen = parisHour >= 9 && parisHour < 17.5;

  // Indicateurs économiques importants
  const economicIndicators = [
    {
      name: 'PIB Zone Euro',
      impact: 'Élevé',
      frequency: 'Trimestriel',
      nextRelease: '15 Mai 2025',
      affectedPairs: ['EUR/USD', 'EUR/GBP', 'EUR/JPY']
    },
    {
      name: 'Taux Directeur BCE',
      impact: 'Très Élevé',
      frequency: 'Toutes les 6 semaines',
      nextRelease: '11 Avril 2025',
      affectedPairs: ['EUR/USD', 'EUR/CHF', 'EUR/GBP']
    },
    {
      name: 'PMI Manufacturier',
      impact: 'Moyen',
      frequency: 'Mensuel',
      nextRelease: '1 Avril 2025',
      affectedPairs: ['EUR/USD', 'EUR/JPY']
    }
  ];

  // Sessions de trading
  const tradingSessions = [
    {
      name: 'Session Asiatique',
      hours: '00:00 - 08:00',
      description: 'Volatilité modérée, focus sur JPY et AUD',
      activity: 'Modérée'
    },
    {
      name: 'Session Européenne',
      hours: '08:00 - 16:30',
      description: 'Haute volatilité, volumes importants',
      activity: 'Élevée'
    },
    {
      name: 'Session Américaine',
      hours: '14:30 - 21:00',
      description: 'Très haute volatilité, USD dominant',
      activity: 'Très Élevée'
    }
  ];

  // Paires de devises les plus volatiles pendant les heures de trading de Paris
  const volatilePairs = [
    { 
      pair: 'EUR/USD',
      description: 'Euro / Dollar US',
      volatility: 'Haute',
      bestHours: '8h-16h',
      spread: '0.0001-0.0003',
      volume: 'Très élevé',
      correlation: 'Forte avec GBP/USD'
    },
    { 
      pair: 'GBP/USD',
      description: 'Livre Sterling / Dollar US',
      volatility: 'Haute',
      bestHours: '8h-16h',
      spread: '0.0002-0.0004',
      volume: 'Élevé',
      correlation: 'Forte avec EUR/USD'
    },
    { 
      pair: 'EUR/GBP',
      description: 'Euro / Livre Sterling',
      volatility: 'Moyenne',
      bestHours: '8h-16h30',
      spread: '0.0002-0.0004',
      volume: 'Moyen',
      correlation: 'Inverse avec USD'
    },
    { 
      pair: 'EUR/CHF',
      description: 'Euro / Franc Suisse',
      volatility: 'Moyenne-Basse',
      bestHours: '8h-16h',
      spread: '0.0003-0.0005',
      volume: 'Moyen',
      correlation: 'Valeur refuge'
    },
    { 
      pair: 'EUR/JPY',
      description: 'Euro / Yen Japonais',
      volatility: 'Haute',
      bestHours: '8h-16h',
      spread: '0.02-0.03',
      volume: 'Élevé',
      correlation: 'Sensible aux taux'
    }
  ].filter(pair => !hiddenPairs.includes(pair.pair));

  const togglePairVisibility = (pair: string) => {
    setHiddenPairs(prev => 
      prev.includes(pair) 
        ? prev.filter(p => p !== pair)
        : [...prev, pair]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
      {/* Paramètres */}
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-4 left-4 bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      {showSettings && (
        <div className="fixed top-16 left-4 bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Paramètres</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Alertes sonores</span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`ml-2 px-3 py-1 rounded ${
                  soundEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                {soundEnabled ? 'Activées' : 'Désactivées'}
              </button>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Paires visibles:</h4>
              <div className="space-y-2">
                {['EUR/USD', 'GBP/USD', 'EUR/GBP', 'EUR/CHF', 'EUR/JPY'].map(pair => (
                  <div key={pair} className="flex items-center gap-2">
                    <button
                      onClick={() => togglePairVisibility(pair)}
                      className="flex items-center gap-2 text-sm"
                    >
                      {hiddenPairs.includes(pair) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {pair}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2">
        {showAlert && (
          <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <Bell className="w-5 h-5" />
            <span>Changement de session de trading !</span>
          </div>
        )}
        {notifications.map((notification, index) => (
          <div 
            key={index}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{notification}</span>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Horloge de Paris */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Heure de Paris
              </h1>
              <div className="text-4xl font-mono">{parisTimeString}</div>
            </div>
            <div className={`text-lg ${isParisMarketOpen ? 'text-green-400' : 'text-red-400'} mb-4`}>
              Marché de Paris: {isParisMarketOpen ? 'OUVERT' : 'FERMÉ'}
            </div>
            
            {/* Statut des autres marchés majeurs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className={`p-3 rounded-lg ${marketStatus.tokyo ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Tokyo</span>
                </div>
                <div className="text-sm opacity-80">00:00 - 08:00</div>
              </div>
              <div className={`p-3 rounded-lg ${marketStatus.frankfurt ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Francfort</span>
                </div>
                <div className="text-sm opacity-80">8:00 - 16:30</div>
              </div>
              <div className={`p-3 rounded-lg ${marketStatus.london ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Londres</span>
                </div>
                <div className="text-sm opacity-80">8:00 - 16:30</div>
              </div>
              <div className={`p-3 rounded-lg ${marketStatus.newyork ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>New York</span>
                </div>
                <div className="text-sm opacity-80">14:30 - 21:00</div>
              </div>
            </div>
          </div>

          {/* Spreads en temps réel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Spreads en temps réel
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(spreads).map(([pair, spread]) => (
                <div key={pair} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{pair}</div>
                    <div className={`text-sm ${
                      spread < 0.0003 ? 'text-green-400' : 
                      spread < 0.0005 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {spread.toFixed(5)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paires les plus actives */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Paires les plus actives
            </h2>
            <div className="grid gap-4">
              {activePairs.map((pair, index) => (
                <div 
                  key={pair.pair} 
                  className={`bg-white/5 rounded-lg p-4 flex items-center justify-between ${
                    index === 0 ? 'border-2 border-yellow-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <div>
                      <div className="text-lg font-semibold">{pair.pair}</div>
                      <div className="text-sm text-gray-300">
                        Activité relative: {pair.activity.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${pair.activity}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Événements à venir */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" />
              Événements à venir
            </h2>
            <div className="grid gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <div>
                        {format(event.date, 'dd MMMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <div>{event.time}</div>
                    </div>
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-300">Impact: {event.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicateurs économiques */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <LineChart className="w-6 h-6" />
              Indicateurs Économiques
            </h2>
            <div className="grid gap-4">
              {economicIndicators.map((indicator) => (
                <div key={indicator.name} className="bg-white/5 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-lg font-semibold">{indicator.name}</div>
                      <div className="text-sm text-gray-300">Impact: {indicator.impact}</div>
                    </div>
                    <div>
                      <div className="text-sm">Fréquence:</div>
                      <div className="text-gray-300">{indicator.frequency}</div>
                    </div>
                    <div>
                      <div className="text-sm">Prochaine publication:</div>
                      <div className="text-gray-300">{indicator.nextRelease}</div>
                    </div>
                    <div>
                      <div className="text-sm">Paires affectées:</div>
                      <div className="text-gray-300">{indicator.affectedPairs.join(', ')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessions de trading */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Sessions de Trading
            </h2>
            <div className="grid gap-4">
              {tradingSessions.map((session) => (
                <div key={session.name} className="bg-white/5 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="text-lg font-semibold">{session.name}</div>
                      <div className="text-sm text-gray-300">{session.hours}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      <span>Activité: {session.activity}</span>
                    </div>
                    <div className="text-sm text-gray-300">{session.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paires volatiles */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Paires de devises volatiles
            </h2>
            <div className="grid gap-4">
              {volatilePairs.map((pair) => (
                <div key={pair.pair} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-semibold">{pair.pair}</div>
                        <div className="text-gray-300">{pair.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span>Volatilité: {pair.volatility}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <div>
                          <div>Meilleures heures:</div>
                          <div className="text-sm text-gray-300">{pair.bestHours}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-green-400" />
                        <div>
                          <div>Spread moyen:</div>
                          <div className="text-sm text-gray-300">{pair.spread}</div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-2 text-sm text-gray-300 flex items-start gap-2">
                      <Info className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{pair.correlation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note d'information */}
          <div className="mt-8 text-sm text-gray-400 text-center">
            <p>Les spreads et la volatilité sont donnés à titre indicatif et peuvent varier selon les conditions du marché.</p>
            <p>Toujours vérifier les conditions actuelles avant de trader.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;