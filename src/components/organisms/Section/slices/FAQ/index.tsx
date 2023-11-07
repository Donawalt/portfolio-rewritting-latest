import Style from './faq.module.scss';

const FAQ = (props: { questions: [] }) => {
    const { questions } = props;

    return (
        <section className={Style.root}>
            <h2 className='do-text-l'>FAQ</h2>
            <ul>
                {questions.map((question: { question_title: string, question_answer: string }, index: number) => {
                    return (
                        <li>
                            <details>
                                <summary>
                                    <h3 className='do-text-default'>{question?.question_title}</h3> <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 16H32M16 0L16 32" stroke="white" />
                                    </svg>
                                </summary>
                                <div>
                                    <p>{question?.question_answer}</p>
                                </div>
                            </details>
                        </li>
                    )
                })}

            </ul>
        </section>
    )
}

export default FAQ;