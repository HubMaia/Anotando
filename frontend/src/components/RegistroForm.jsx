import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import novoRegistroImage from '../assets/images/NOVOREGISTRO-IMAGE.png';
import cafeManhaImage from '../assets/images/CAFE-DA-MANHA.png';
import cafeManhaJejumImage from '../assets/images/CAFE-DA-MANHA-JEJUM.png';
import almocoImage from '../assets/images/ALMOÇO.png';
import almocoJejumImage from '../assets/images/ALMOÇO-JEJUM.png';
import cafeTardeImage from '../assets/images/CAFE-DA-TARDE.png';
import cafeTardeJejumImage from '../assets/images/CAFE-DA-TARDE-JEJUM.png';
import jantaImage from '../assets/images/JANTA.png';
import jantaJejumImage from '../assets/images/JANTA-JEJUM.png';
import novoImage from '../assets/images/NOVO.png';
import novoJejumImage from '../assets/images/NOVO-JEJUM.png';
import './RegistroForm.css';

const RegistroForm = ({ onRegistroAdded }) => {
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0], // Data atual como padrão
    horario: '',
    valor_glicemia: '',
    descricao_refeicao: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [glicemiaWarning, setGlicemiaWarning] = useState('');
  const [isCustomHorario, setIsCustomHorario] = useState(false);
  const [customHorarioText, setCustomHorarioText] = useState('');
  const [customHorarioTipo, setCustomHorarioTipo] = useState('');
  const dropdownRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isReadyToListen, setIsReadyToListen] = useState(false);
  const [isListeningTime, setIsListeningTime] = useState(false);
  const [isReadyToListenTime, setIsReadyToListenTime] = useState(false);
  const recognitionRef = useRef(null);
  const timeRecognitionRef = useRef(null);
  const speechRef = useRef(null);
  const [isListeningPredefined, setIsListeningPredefined] = useState(false);
  const [isReadyToListenPredefined, setIsReadyToListenPredefined] = useState(false);
  const predefinedRecognitionRef = useRef(null);

  const horarios = [
    { 
      value: 'Cafe - Antes', 
      label: 'Café da Manhã (Em jejum)', 
      icon: cafeManhaJejumImage, 
      keywords: ['café', 'cafe', 'café da manhã', 'cafe da manha', 'desjejum', 'desjejo', 'manhã', 'manha'],
      description: 'Antes de comer pela manhã'
    },
    { 
      value: 'Cafe - Depois', 
      label: 'Café da Manhã (Após comer)', 
      icon: cafeManhaImage, 
      keywords: ['café', 'cafe', 'café da manhã', 'cafe da manha', 'desjejum', 'desjejo', 'manhã', 'manha'],
      description: 'Depois de comer pela manhã'
    },
    { 
      value: 'Almoco - Antes', 
      label: 'Almoço (Em jejum)', 
      icon: almocoJejumImage, 
      keywords: ['almoço', 'almoco', 'almoço', 'almoco', 'meio dia', 'meio-dia', 'meiodia'],
      description: 'Antes de almoçar'
    },
    { 
      value: 'Almoco - Depois', 
      label: 'Almoço (Após comer)', 
      icon: almocoImage, 
      keywords: ['almoço', 'almoco', 'almoço', 'almoco', 'meio dia', 'meio-dia', 'meiodia'],
      description: 'Depois de almoçar'
    },
    { 
      value: 'Cafe-Tarde - Antes', 
      label: 'Café da Tarde (Em jejum)', 
      icon: cafeTardeJejumImage, 
      keywords: ['café da tarde', 'cafe da tarde', 'lanche da tarde', 'lanche', 'tarde'],
      description: 'Antes do lanche da tarde'
    },
    { 
      value: 'Cafe-Tarde - Depois', 
      label: 'Café da Tarde (Após comer)', 
      icon: cafeTardeImage, 
      keywords: ['café da tarde', 'cafe da tarde', 'lanche da tarde', 'lanche', 'tarde'],
      description: 'Depois do lanche da tarde'
    },
    { 
      value: 'Janta - Antes', 
      label: 'Jantar (Em jejum)', 
      icon: jantaJejumImage, 
      keywords: ['janta', 'jantar', 'ceia', 'jantar', 'noite'],
      description: 'Antes de jantar'
    },
    { 
      value: 'Janta - Depois', 
      label: 'Jantar (Após comer)', 
      icon: jantaImage, 
      keywords: ['janta', 'jantar', 'ceia', 'jantar', 'noite'],
      description: 'Depois de jantar'
    },
    { 
      value: 'custom', 
      label: 'Horário Personalizado', 
      icon: novoImage, 
      keywords: ['personalizado', 'outro', 'diferente'],
      description: 'Escolher outro horário'
    }
  ];

  const tiposHorario = [
    { value: 'Antes', label: 'Antes (Em jejum)' },
    { value: 'Depois', label: 'Depois (Após comer)' }
  ];

  const popularFoods = {
    'Café da Manhã': [
      'Pão francês',
      'Café com leite',
      'Manteiga',
      'Queijo',
      'Presunto',
      'Ovos',
      'Frutas',
      'Suco de laranja',
      'Iogurte',
      'Granola'
    ],
    'Almoço': [
      'Arroz',
      'Feijão',
      'Bife',
      'Frango',
      'Salada',
      'Batata',
      'Macarrão',
      'Farofa',
      'Couve',
      'Peixe',
      'Carne Moída',
      'Omelete',
      'Legumes',
      'Purê de Batata',
      'Sopa',
      'Risoto',
      'Lasanha',
      'Strogonoff',
      'Carne Assada',
      'Frango Assado'
    ],
    'Café da Tarde': [
      'Bolo',
      'Café',
      'Pão de queijo',
      'Biscoito',
      'Sanduíche',
      'Suco',
      'Vitamina',
      'Iogurte',
      'Frutas',
      'Chá'
    ],
    'Jantar': [
      'Sopa',
      'Salada',
      'Sanduíche',
      'Pizza',
      'Lasanha',
      'Risoto',
      'Peixe',
      'Frango',
      'Arroz',
      'Macarrão',
      'Carne Moída',
      'Omelete',
      'Legumes',
      'Purê de Batata',
      'Bife',
      'Feijão',
      'Farofa',
      'Couve',
      'Carne Assada',
      'Frango Assado'
    ]
  };

  const periodosDia = {
    'madrugada': '00:00',
    'meia noite': '00:00',
    'meia-noite': '00:00',
    'meianoite': '00:00',
    'manhã': '08:00',
    'manha': '08:00',
    'meio dia': '12:00',
    'meio-dia': '12:00',
    'meiodia': '12:00',
    'tarde': '15:00',
    'noite': '20:00',
    'de noite': '20:00',
    'de tarde': '15:00',
    'de manhã': '08:00',
    'de manha': '08:00'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Inicializa o reconhecimento de voz para glicemia
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Extrai apenas números do texto falado
        const numbers = transcript.match(/\d+/);
        if (numbers) {
          const value = parseInt(numbers[0]);
          if (value > 0 && value <= 600) {
            setFormData(prev => ({
              ...prev,
              valor_glicemia: value.toString()
            }));
            // Confirma o valor por voz
            speak(`Anotei ${value} como valor da sua glicemia. Se precisar corrigir, é só clicar no microfone novamente.`);
            toast.success('Valor registrado com sucesso!');
          } else {
            speak('Ops! O valor precisa estar entre 1 e 600. Vamos tentar de novo? Clique no microfone.');
            toast.error('Por favor, fale um valor entre 1 e 600');
          }
        } else {
          speak('Desculpe, não consegui entender o valor. Vamos tentar novamente? Clique no microfone.');
          toast.error('Não consegui entender o valor. Por favor, tente novamente.');
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        speak('Ops! Tivemos um probleminha. Vamos tentar de novo? Clique no microfone.');
        toast.error('Erro ao reconhecer voz. Por favor, tente novamente.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Inicializa a síntese de voz
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
    }

    // Inicializa o reconhecimento de voz para horários pré-definidos
    if ('webkitSpeechRecognition' in window) {
      predefinedRecognitionRef.current = new window.webkitSpeechRecognition();
      predefinedRecognitionRef.current.continuous = false;
      predefinedRecognitionRef.current.interimResults = false;
      predefinedRecognitionRef.current.lang = 'pt-BR';

      predefinedRecognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        // Verifica se mencionou "depois" primeiro, depois "antes"
        const isDepois = transcript.includes('depois') || transcript.includes('após') || transcript.includes('apos');
        const isAntes = !isDepois && (transcript.includes('antes') || transcript.includes('jejum'));
        
        // Procura por palavras-chave dos horários
        let horarioEncontrado = null;
        for (const horario of horarios) {
          if (horario.keywords.some(keyword => transcript.includes(keyword))) {
            horarioEncontrado = horario;
            break;
          }
        }
        
        if (horarioEncontrado) {
          if (horarioEncontrado.value === 'custom') {
            setIsCustomHorario(true);
            speak('Vou abrir o horário personalizado para você. Fale o horário ou período desejado.');
          } else {
            const horarioValue = horarioEncontrado.value.split(' - ')[0];
            const horarioCompleto = `${horarioValue} - ${isAntes ? 'Antes' : 'Depois'}`;
            setFormData(prev => ({
              ...prev,
              horario: horarioCompleto
            }));
            // Extraindo apenas o nome da refeição do label (removendo o status entre parênteses)
            const nomeRefeicao = horarioEncontrado.label.split(' (')[0].toLowerCase();
            speak(`Anotei ${nomeRefeicao} ${isAntes ? 'em jejum' : 'depois do jejum'}. Se precisar corrigir, é só clicar no microfone novamente.`);
          }
        } else {
          // Limpa o texto do horário personalizado
          let customText = transcript
            .replace(/em jejum/g, '')
            .replace(/depois do jejum/g, '')
            .replace(/antes/g, '')
            .replace(/depois/g, '')
            .replace(/ap[oó]s/g, '')
            .replace(/apos/g, '')
            .replace(/jejum/g, '')
            .replace(/  +/g, ' ')
            .trim();
          setIsCustomHorario(true);
          setCustomHorarioText(customText);
          setCustomHorarioTipo(isAntes ? 'Antes' : (isDepois ? 'Depois' : ''));
          setFormData(prev => ({
            ...prev,
            horario: `${customText}${isAntes ? ' - Antes' : (isDepois ? ' - Depois' : '')}`
          }));
          speak(`Anotei ${customText} ${isAntes ? 'em jejum' : (isDepois ? 'depois do jejum' : '')}. Se precisar corrigir, é só clicar no microfone novamente.`);
        }
        
        setIsListeningPredefined(false);
        setIsReadyToListenPredefined(false);
      };

      predefinedRecognitionRef.current.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        speak('Ops! Tivemos um probleminha. Vamos tentar de novo?');
        setIsListeningPredefined(false);
        setIsReadyToListenPredefined(false);
      };

      predefinedRecognitionRef.current.onend = () => {
        setIsListeningPredefined(false);
        setIsReadyToListenPredefined(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechRef.current) {
        speechRef.current.cancel();
      }
      if (predefinedRecognitionRef.current) {
        predefinedRecognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text) => {
    if (speechRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Tenta encontrar uma voz em português
      const voices = speechRef.current.getVoices();
      const portugueseVoice = voices.find(voice => voice.lang.includes('pt'));
      if (portugueseVoice) {
        utterance.voice = portugueseVoice;
      }
      
      speechRef.current.speak(utterance);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'data') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (selectedDate > today) {
        toast.error('Não é possível registrar glicemia para datas futuras');
        return;
      }
    }
    
    if (name === 'valor_glicemia') {
      const valor = parseInt(value);
      if (valor > 600) {
        toast.error('O valor glicêmico não pode ser maior que 600 mg/dL');
        return;
      }
      if (valor >= 300) {
        toast.warning('Atenção: Valor glicêmico muito alto. Recomendamos procurar ajuda médica.');
      } else {
        setGlicemiaWarning('');
      }
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };

  const handleHorarioSelect = (horario) => {
    if (horario.value === 'custom') {
      setIsCustomHorario(true);
      setFormData({
        ...formData,
        horario: ''
      });
    } else {
      setIsCustomHorario(false);
      setFormData({
        ...formData,
        horario: horario.value
      });
    }
    setIsDropdownOpen(false);
    setError('');
    setSuccess('');
  };

  const handleCustomHorarioChange = (e) => {
    const { value } = e.target;
    setCustomHorarioText(value);
    if (customHorarioTipo) {
      setFormData({
        ...formData,
        horario: `${value} - ${customHorarioTipo}`
      });
    }
  };

  const handleCustomHorarioTipoChange = (e) => {
    const { value } = e.target;
    setCustomHorarioTipo(value);
    if (customHorarioText) {
      setFormData({
        ...formData,
        horario: `${customHorarioText} - ${value}`
      });
    }
  };

  const handleFoodItemClick = (foodItem) => {
    const currentDescription = formData.descricao_refeicao;
    const newDescription = currentDescription 
      ? `${currentDescription}, ${foodItem}`
      : foodItem;
    
    setFormData({
      ...formData,
      descricao_refeicao: newDescription
    });
  };

  const getCurrentMealType = () => {
    if (!formData.horario) return null;
    
    // Check if it's a custom time with "Depois"
    if (customHorarioTipo === 'Depois') {
      return 'Todos';
    }
    
    if (formData.horario.includes('Cafe - Depois')) return 'Café da Manhã';
    if (formData.horario.includes('Almoco - Depois')) return 'Almoço';
    if (formData.horario.includes('Cafe-Tarde - Depois')) return 'Café da Tarde';
    if (formData.horario.includes('Janta - Depois')) return 'Jantar';
    
    return null;
  };

  const getAllFoodItems = () => {
    return [
      ...popularFoods['Café da Manhã'],
      ...popularFoods['Almoço'],
      ...popularFoods['Café da Tarde'],
      ...popularFoods['Jantar']
    ];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.data || !formData.horario || !formData.valor_glicemia) {
      toast.error('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/registros',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Registro salvo com sucesso!');
      
      // Limpar o formulário, mas manter a data atual
      setFormData({
        data: formData.data,
        horario: '',
        valor_glicemia: '',
        descricao_refeicao: ''
      });
      
      // Notificar o componente pai (para atualizar a lista de registros)
      if (onRegistroAdded) {
        onRegistroAdded();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        'Erro ao salvar o registro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedHorario = horarios.find(h => h.value === formData.horario);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Seu navegador não suporta reconhecimento de voz');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsReadyToListen(false);
    } else {
      try {
        // Fala a pergunta antes de começar a gravar
        speak('Em quanto está sua glicemia?');
        
        // Mostra que está aguardando
        setIsListening(true);
        setIsReadyToListen(false);
        
        // Pequeno delay para a pergunta ser feita antes de começar a gravar
        setTimeout(() => {
          recognitionRef.current.start();
          setIsReadyToListen(true);
        }, 3000); // 3 segundos de delay
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        toast.error('Erro ao iniciar reconhecimento de voz');
        setIsListening(false);
        setIsReadyToListen(false);
      }
    }
  };

  const toggleTimeListening = () => {
    if (!timeRecognitionRef.current) {
      toast.error('Seu navegador não suporta reconhecimento de voz');
      return;
    }

    if (isListeningTime) {
      timeRecognitionRef.current.stop();
      setIsListeningTime(false);
      setIsReadyToListenTime(false);
    } else {
      try {
        speak('Fale o horário ou período e se é em jejum ou depois do jejum. Por exemplo: "madrugada em jejum" ou "manhã depois do jejum"');
        setIsListeningTime(true);
        setIsReadyToListenTime(false);
        
        setTimeout(() => {
          timeRecognitionRef.current.start();
          setIsReadyToListenTime(true);
        }, 11000); // Alterado de 9000 para 11000 (11 segundos)
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        toast.error('Erro ao iniciar reconhecimento de voz');
        setIsListeningTime(false);
        setIsReadyToListenTime(false);
      }
    }
  };

  const togglePredefinedListening = () => {
    if (!predefinedRecognitionRef.current) {
      toast.error('Seu navegador não suporta reconhecimento de voz');
      return;
    }

    if (isListeningPredefined) {
      predefinedRecognitionRef.current.stop();
      setIsListeningPredefined(false);
      setIsReadyToListenPredefined(false);
    } else {
      try {
        speak('Fale qual refeição e se é em jejum ou depois do jejum. Por exemplo: "café da manhã em jejum" ou "almoço depois do jejum"');
        setIsListeningPredefined(true);
        setIsReadyToListenPredefined(false);
        
        setTimeout(() => {
          predefinedRecognitionRef.current.start();
          setIsReadyToListenPredefined(true);
        }, 11000);
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        toast.error('Erro ao iniciar reconhecimento de voz');
        setIsListeningPredefined(false);
        setIsReadyToListenPredefined(false);
      }
    }
  };

  return (
    <div className="registro-form-container">
      <div className="registro-header">
        <img src={novoRegistroImage} alt="Novo Registro" className="novo-registro-image" />
      <h3>Novo Registro</h3>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="data">Data</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="horario">Horário</label>
          {isCustomHorario ? (
            <div className="custom-horario-input">
              <div className="horario-input-container">
                <input
                  type="text"
                  id="horario"
                  name="horario"
                  value={customHorarioText}
                  onChange={handleCustomHorarioChange}
                  placeholder="Digite seu horário personalizado"
                  maxLength={50}
                  required
                />
                <button
                  type="button"
                  className={`voice-button ${isListeningTime ? (isReadyToListenTime ? 'listening' : 'waiting') : ''}`}
                  onClick={toggleTimeListening}
                  title="Falar horário"
                >
                  {isListeningTime ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  )}
                </button>
                <div className={`voice-status ${isListeningTime ? 'show' : ''}`}>
                  {isListeningTime 
                    ? (isReadyToListenTime 
                        ? 'Fale o horário ou período...' 
                        : 'Aguarde...')
                    : 'Clique para falar'}
                </div>
              </div>
              <button
                type="button"
                className="back-button"
                onClick={() => {
                  setIsCustomHorario(false);
                  setCustomHorarioText('');
                  setCustomHorarioTipo('');
                  setFormData({
                    ...formData,
                    horario: ''
                  });
                }}
              >
                Voltar
              </button>
            </div>
          ) : (
            <div className="custom-select" ref={dropdownRef}>
              <div 
                className="select-selected"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedHorario ? (
                  <div className="selected-option">
                    <img src={selectedHorario.icon} alt="" className="time-icon" />
                    <div className="selected-option-text">
                      <span className="selected-option-label">{selectedHorario.label}</span>
                      <span className="selected-option-description">{selectedHorario.description}</span>
                    </div>
                  </div>
                ) : (
                  'Selecione o horário'
                )}
              </div>
              <button
                type="button"
                className={`voice-button ${isListeningPredefined ? (isReadyToListenPredefined ? 'listening' : 'waiting') : ''}`}
                onClick={togglePredefinedListening}
                title="Falar horário"
              >
                {isListeningPredefined ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                )}
              </button>
              <div className={`voice-status ${isListeningPredefined ? 'show' : ''}`}>
                {isListeningPredefined 
                  ? (isReadyToListenPredefined 
                      ? 'Fale qual refeição...' 
                      : 'Aguarde...')
                  : 'Clique para falar'}
              </div>
              {isDropdownOpen && (
                <div className="select-items">
                  {horarios.map(horario => (
                    <div
                      key={horario.value}
                      className="select-item"
                      onClick={() => handleHorarioSelect(horario)}
                    >
                      <img src={horario.icon} alt="" className="time-icon" />
                      <div className="select-item-text">
                        <span className="select-item-label">{horario.label}</span>
                        <span className="select-item-description">{horario.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="valor_glicemia">Em quanto está sua glicemia? (mg/dL)</label>
          <div className="glicemia-input-container">
            <input
              type="number"
              id="valor_glicemia"
              name="valor_glicemia"
              value={formData.valor_glicemia}
              onChange={handleChange}
              min="0"
              max="600"
              required
              placeholder="Ex: 120"
            />
            <button
              type="button"
              className={`voice-button ${isListening ? (isReadyToListen ? 'listening' : 'waiting') : ''}`}
              onClick={toggleListening}
              title="Falar valor da glicemia"
            >
              {isListening ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                  <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                  <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              )}
            </button>
            <div className={`voice-status ${isListening ? 'show' : ''}`}>
              {isListening 
                ? (isReadyToListen 
                    ? 'Fale o valor da sua glicemia...' 
                    : 'Aguarde...')
                : 'Clique para falar'}
            </div>
          </div>
          {glicemiaWarning && (
            <div className="warning-message">
              {glicemiaWarning}
            </div>
          )}
        </div>
        
        <div className="form-group">
          {(!formData.horario.includes('Antes') && customHorarioTipo !== 'Antes' && formData.horario) || 
           (isCustomHorario && customHorarioTipo === 'Depois') ? (
            <>
              <div className="popular-foods-container">
                <h4>O que você comeu nesse horário?</h4>
                <div className="popular-foods-list">
                  {getCurrentMealType() && (
                    getCurrentMealType() === 'Todos' 
                      ? getAllFoodItems().map((food, index) => (
                          <button
                            key={index}
                            type="button"
                            className="food-item-button"
                            onClick={() => handleFoodItemClick(food)}
                          >
                            {food}
                          </button>
                        ))
                      : popularFoods[getCurrentMealType()].map((food, index) => (
                          <button
                            key={index}
                            type="button"
                            className="food-item-button"
                            onClick={() => handleFoodItemClick(food)}
                          >
                            {food}
                          </button>
                        ))
                  )}
                </div>
              </div>
              
              <textarea
                id="descricao_refeicao"
                name="descricao_refeicao"
                value={formData.descricao_refeicao}
                onChange={handleChange}
                placeholder="Monte seu cardápio:"
                rows="3"
              />
            </>
          ) : null}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
};

export default RegistroForm; 