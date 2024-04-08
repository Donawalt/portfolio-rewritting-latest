import Style from './faq.module.scss';
import { useEffect } from 'react';
import { useRef } from 'react';
import gsap from 'gsap';
const FAQ = (props: { questions: [] }) => {
    const { questions } = props;

    const root = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (root.current) {
            const accordions = [
                ...root.current.querySelectorAll(
                    "details"
                ),
            ];
            accordions && accordions.forEach((targetDetail) => {
                targetDetail && targetDetail
                    .querySelector("summary")
                    ?.addEventListener("click", (event) => {
                        event.preventDefault();
                        accordions.forEach((detail) => {
                            if (detail === targetDetail && !detail.getAttribute("open")) {
                                openDetail(detail);
                            } else {
                                closeDetail(detail);
                            }
                        });
                    });
            });

        }

        const openDetail = (detail:  HTMLDetailsElement | HTMLBaseElement) => {
            if (detail) {
                detail.removeAttribute("style");
                gsap.killTweensOf(detail);
                const summary = detail.querySelector('summary');
                let baseHeight = summary?.getBoundingClientRect().height;
                detail.setAttribute("open", "true");
                let targetHeight = detail.getBoundingClientRect().height;
                let tl = gsap.timeline();
                tl.fromTo(detail, { height: baseHeight }, { height: targetHeight });
            }

        };
        const closeDetail = (detail: HTMLDetailsElement | HTMLBaseElement) => {
            if (detail) {
                detail.removeAttribute("style");
                gsap.killTweensOf(detail);
                gsap.killTweensOf(detail.querySelector("p"));
                const summary = detail.querySelector('summary');
                let tl = gsap.timeline();
                tl.fromTo(
                    detail,
                    { height: detail.getBoundingClientRect().height, ease: "easeOutExpo" },
                    {
                        height: summary?.getBoundingClientRect()
                            .height,
                        ease: "easeOutExpo",
                        onStart: () => {
                            detail.removeAttribute("open");
                        },
                    }
                );
            }
        };
    }, [root.current]);

    return (
        <section className={Style.root}>
            <h2 className='do-text-l'>FAQ</h2>
            <ul ref={root}>
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