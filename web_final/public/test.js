
const { useState } = React;
const { render } = ReactDOM;

// Categorized RAADS-R Questions
const RAADSRQuestions = {
    "Social/Communication": [
        "I have difficulty understanding social rules.",
        "I find it hard to make eye contact.",
        "I prefer to be alone rather than with others.",
        "I find it difficult to start a conversation.",
        "I often feel overwhelmed in social situations.",
        "I have trouble recognizing when others are joking.",
        "I find it hard to understand how people feel.",
    ],
    "Circumscribed Interests": [
        "I enjoy doing things on my own.",
        "I dislike changes in routine.",
        "I find it difficult to switch between activities.",
        "I get intensely interested in particular hobbies or subjects.",
        "I have a rigid routine that I must follow.",
        "I enjoy collecting things.",
    ],
    "Sensory-Motor": [
        "I feel uncomfortable when others touch me.",
        "I am overly sensitive to certain textures.",
        "I find bright lights or loud noises overwhelming.",
        "I often feel the need to touch things repetitively.",
        "I have difficulty with fine motor skills like writing or using tools.",
    ],
    "Other": [
        "I prefer to do things in a structured manner.",
        "I have difficulty understanding humor in conversation.",
        "I find it hard to cope with unexpected changes.",
        "I have repetitive behaviors or routines.",
        "I often misinterpret social situations.",
    ],
};



const RAADSRApp = () => {
    const [username, setUsername] = useState('');
    const [answers, setAnswers] = useState(Array(80).fill(null)); // Initialize with null
    const [currentPage, setCurrentPage] = useState(1); // To keep track of the current page
    const [showScore, setShowScore] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [score, setScore] = useState(0); // To store the test score
    const [scoreMessage, setScoreMessage] = useState(""); // To store the interpretation message
    const [selectedCategory, setSelectedCategory] = useState('Social/Communication'); // Default category

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const startTest = () => {
        if (username.trim() === "") {
            alert("Please enter your username.");
            return;
        }
        setTestStarted(true);
    };

    const handleAnswerChange = (category, index, e) => {
        const newAnswers = [...answers];
        newAnswers[index] = parseInt(e.target.value, 10);  // Store the value as an integer (0, 1, 2, or 3)
        setAnswers(newAnswers);
    };

    const handleNextPage = () => {
        const testScore = calculateScore();
        setScore(testScore);  // Store the calculated score
        setScoreMessage(getScoreMessage(testScore));  // Get the interpretation message
        setShowScore(true);
    };

    const calculateScore = () => {
        return answers.reduce((total, answer) => total + (answer || 0), 0);
    };

    const getScoreMessage = (score) => {
        if (score < 5) return "You are not autistic.";
        if (score >= 5 && score < 10) return "Some autistic traits, but likely not autistic.Recommended level : primary";
        if (score >= 10 && score < 15) return "Some autistic traits, but likely not autistic (yet likely to be it ).Recommended level : primary";
        if (score >= 15 && score < 20) return "The minimum score at which autism is considered.Recommended level : intermediate";
        if (score >= 90 && score < 130) return "Stronger indications of autism, although non-autistics may score as high.";
        if (score >= 130 && score < 160) return "The mean score of autistic people; strong evidence for autism.";
        if (score >= 160 && score < 227) return "Very strong evidence for autism.";
        if (score >= 227 && score < 240) return "The maximum score autistic people acquired in Ritvo’s seminal paper on the RAADS-R.";
        return "The maximum possible RAADS-R score.";
    };

    return (
        <div className="container">
            <h1>RAADS-R Autism Test</h1>
            {!testStarted ? (
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username"
                    />
                    <button onClick={startTest}>Start Test</button>
                </div>
            ) : (
                <div>
                    <div>
                        <h2>Select a Category</h2>
                        {Object.keys(RAADSRQuestions).map((category) => (
                            <button key={category} onClick={() => setSelectedCategory(category)}>
                                {category}
                            </button>
                        ))}
                    </div>

                    {RAADSRQuestions[selectedCategory].map((question, questionIndex) => (
                        <div className="question-container" key={questionIndex}>
                            <p>{question}</p>
                            <label>
                                <input
                                    type="radio"
                                    value="0"
                                    checked={answers[questionIndex] === 0}
                                    onChange={(e) => handleAnswerChange(selectedCategory, questionIndex, e)}
                                />
                                Never or rarely true
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="1"
                                    checked={answers[questionIndex] === 1}
                                    onChange={(e) => handleAnswerChange(selectedCategory, questionIndex, e)}
                                />
                                Sometimes true
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="2"
                                    checked={answers[questionIndex] === 2}
                                    onChange={(e) => handleAnswerChange(selectedCategory, questionIndex, e)}
                                />
                                Often true
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="3"
                                    checked={answers[questionIndex] === 3}
                                    onChange={(e) => handleAnswerChange(selectedCategory, questionIndex, e)}
                                />
                                Very often or always true
                            </label>
                        </div>
                    ))}

                    <button onClick={handleNextPage}>Submit Test</button>
                </div>
            )}

            {showScore && (
                <div className="score">
                    <h2>Your Score: {score}</h2>
                    <div>
                        <h3>RAADS-R Score Interpretation</h3>
                        <p>{scoreMessage}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

render(
    React.createElement(RAADSRApp),
    document.getElementById("root")
);
