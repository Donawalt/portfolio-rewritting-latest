import SplitType from "split-type";
import gsap from "gsap";

const animateTitle = () => {
  let creativeSplit = new SplitType("#creative", { type: "chars" });
  let developperSplit = new SplitType("#developper", { type: "chars" });


  gsap.set("#creative", { opacity: 1 });
  gsap.set("#developper", { opacity: 1 });
  let tl = gsap.timeline();
  tl.fromTo(
    creativeSplit.chars,
    {
      opacity: 0,
      y: 100,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: {
        // wrap advanced options in an object
        each: 0.05,
        from: "center",
      },
    }
  );

  tl.fromTo(
    developperSplit.chars,
    {
      opacity: 0,
      y: 100,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: -0.5,
      stagger: {
        // wrap advanced options in an object
        each: 0.05,
        from: "center",
      },
    }
  );

  tl.fromTo("#and", { opacity: 0 }, { opacity: 1, delay: -0.25 });
};

export default animateTitle;
