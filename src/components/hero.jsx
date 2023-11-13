import aIimage from '../assets/ai_image.png'
import axios from 'axios'
import { useState,useEffect } from 'react'

const Hero = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [extractiveness, setExtractiveness] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [length, setLength] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleExtractiveness = (event) => {
    setExtractiveness(event.target.value);
  };
  const handlelength = (event) => {
    setLength(event.target.value);
  };
  const [text, setText] = useState('');
  const [typedSummary, setTypedSummary] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [copied, setCopied] = useState("")
  
    const handleCopy = () => {
    setCopied(typedSummary)
    navigator.clipboard.writeText(typedSummary)
    setTimeout(()=>setCopied(false),3000)
    
  }


  const handleTextAreaChange = (e) => {
    setText(e.target.value);
    const text = e.target.value;
    const words = text.split(' ');
    const count = words.length;
    setWordCount(count);
  };
  const handleSummarize = () => {
    const noOfWords = text.split(' ');
    if (noOfWords.length < 50) {
      alert('Please enter at least 50 words');
      return;
    }

    setIsLoading(true)
    const options = {
      method: 'POST',
      url: 'https://api.cohere.ai/v1/summarize',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer tm0SkyqezvL7Wf8aUIo0cLAtBGywGWOBNonFh3Bd',
      },
      data: {
        length: length ? length : 'auto',
        format: selectedOption? selectedOption : 'paragraph',
        model: 'command',
        extractiveness: extractiveness ? extractiveness : 'auto',
        temperature: 0,
        text: text,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        // Split the summary text into words
        console.log(response.data.summary)
        const summaryWords = response.data.summary.split(' ');

        // Create a typing effect with a delay
        let typedText = '';
        let index = 0;
        const interval = setInterval(() => {
          if (index < summaryWords.length) {
            typedText += ' ' + summaryWords[index];
            setIsLoading(false)
            setTypedSummary(typedText);
            setWordIndex(index);
            index++;
          } else {
            clearInterval(interval);
          }
        }, 200); // Adjust the delay as needed
      })
      .catch(function (error) {
        console.error(error);
      });
    
  }
    useEffect(() => {
    setTypedSummary(''); // Reset typedSummary when text changes
  }, [text]);

  return (
    <div className='m-auto pt-2 flex justify-center '>
      <div>
      <p className="lg:text-4xl xl:text-5xl text-cyan-800 font-poppins font-thin shadow-md text-2xl text-center ">Your Personal AI Summarizer: Say Goodbye to Lengthy Texts!</p>
      <div className='flex flex-col lg:flex-row justify-around items-center pt-2 px-3'>
        <div>
          <img src={aIimage} alt="AI Image" className='' />
        </div>
        <div className='max-w-2xl'><p className='text-lg lg:text-xl text-gray-500 font-light font-poppins '> <span className='text-cyan-800'> What does SumText do? </span><br/>SumText simplifies any text by condensing it into clear and easy-to-read content. Say goodbye to lengthy texts and information overload, as SumText empowers you to access key insights and knowledge concisely and efficiently.</p>
          
        </div>
      </div>
      <div className='flex lg:flex-row justify-between justify-items-center gap-4 pt-6 flex-col'>
        <div className='px-3 md:mx-28 lg:m-0'>
          <p className="text-gray-300 mt-5 font-merriweather">
            Type of Summary:
          </p>
          <select
            className="block w-full px-12 py-2 mt-3 leading-5 rounded-lg border border-cyan-800 focus:outline-none focus:ring focus:border-blue-300 text-sm text-gray-200 font-poppins bg-cyan-800"
            onChange={handleSelectChange}
            value={selectedOption}>
            <option value="paragraph">Paragraph </option>
            <option value="bullets">Bullet Points</option>
          </select>
          <p className="text-gray-300 mt-5 font-merriweather">
            Closeness of summary to original text:
          </p>
          <select
            className="block w-full mt-3 px-12 py-2  leading-5  rounded-lg  text-gray-200 font-poppins focus:outline-none focus:ring focus:border-blue-300 bg-cyan-800 text-sm "
            onChange={handleExtractiveness}
            value={extractiveness}>
            <option value="auto">Auto </option>
            <option value="high">High</option>
            <option value="medium">
              Medium</option>
            <option value="low">Low</option>
          </select>
          <p className="text-gray-300 mt-5 font-merriweather">
            Length of summary:
          </p>
          <select
            className="block w-full px-12 py-2 mt-2 leading-5 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-sm border-none text-gray-200 font-poppins bg-cyan-800 "
            onChange={handlelength}
            value={length}>
            <option value="auto">Auto </option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
          <button className="group relative overflow-hidden transition-transform transform hover:scale-105 border border-cyan-600 hover:bg-cyan-800  py-2 px-20 rounded-lg mt-5 text-cyan-600 text-lg hover:text-gray-200 hidden lg:block" onClick={handleSummarize}>
            <span className="absolute inset-0 w-full h-full bg-cyan-800 opacity-5  transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 "></span>
            Summarize
          </button>
        </div>
        <div className='pt-8 lg:pt-0'>
          <div className='flex justify-between items-center m-auto'>
            <p className='text-gray-500 text-2xl pb-2 flex font-merriweather px-2'>Original Text </p>
            <p className='text-gray-500 text-xl pb-2 flex mr-5 font-merriweather'>{wordCount}/255,000</p>

            </div>
            <div className='px-2'>
              <textarea
            onChange={handleTextAreaChange}
          className=" w-full lg:w-[30vw] h-[50vh] p-4 rounded-lg transition focus:outline-none focus:border-cyan-500 focus:h-120 text-lg font-poppins"
          placeholder="Paste your text here to summarize..."
              />
            </div>
            <div className='px-2'>
              <button className="group relative overflow-hidden transition-transform transform hover:scale-105  bg-cyan-800 hover:bg-cyan-800 
            py-2 px-28 rounded-lg mt-5 text-white text-lg hover:text-gray-200 flex justify-items-center m-auto lg:hidden " onClick={handleSummarize}>
            <span className="absolute inset-0 w-full h-full bg-cyan-800 opacity-5  transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 "></span>
            Summarize
              </button>
            </div>

        </div>
        <div className='pb-4'>
            <p className='text-gray-500 text-2xl pb-2 font-merriweather font-thin shadow-md px-2'>AI summarized text</p>
            <div className='px-2'>
              <div className='bg-white w-full lg:w-[30vw] lg:h-[50vh] h-[80vh] rounded-lg text-lg font-poppins'>
            {isLoading ? (
              <div className='spinner-container'>
                <div className='spinner'>        
                </div>
              </div>

        ) :(typedSummary && (
              <div className='p-4'>
                <p>{typedSummary}</p>
              </div>)
            )}
          </div>

            </div>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Hero