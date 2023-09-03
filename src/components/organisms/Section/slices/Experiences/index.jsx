import ExperiencesStyle from "./experiences.module.scss";
import { isValidElement } from "react";
import { CompaniesLogo } from "../../../../atoms/Logo/index.";

const Experiences = ({ title, description, experiences }) => {
  return (
    <section className={ExperiencesStyle.do_experiences}>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <ul>
        {experiences.map((experience, index) => {
          return (
            <li key={index}>
              <div>{isValidElement(experience.icone) ? experience.icone : (<CompaniesLogo type={experience.icone}/>)}</div>
              <p>{experience.name}</p>
              <p>{experience.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Experiences;
