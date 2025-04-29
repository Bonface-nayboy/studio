
import type React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 100" // Adjusted viewBox for better aspect ratio
    width="120" // Adjust width as needed
    height="60"  // Adjust height as needed
    {...props}
  >
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 60px;
          fill: hsl(25, 88%, 55%); /* Orange color similar to image */
          font-weight: 700; /* Bold */
          font-style: italic;
        }
        .leaf {
          fill: hsl(25, 88%, 55%); /* Orange color */
        }
      `}
    </style>
    {/* Decorative Leaves */}
    <g transform="translate(80, 5)">
      <path className="leaf" d="M10 0 C 15 5, 15 15, 10 20 Q 5 15, 0 18 C 5 10, 5 5, 10 0 Z" />
      <path className="leaf" d="M20 5 C 23 10, 23 18, 20 23 Q 17 18, 14 20 C 17 13, 17 8, 20 5 Z" transform="scale(0.9) translate(5, -2)" />
      <path className="leaf" d="M0 5 C -3 10, -3 18, 0 23 Q 3 18, 6 20 C 3 13, 3 8, 0 5 Z" transform="scale(0.9) translate(-5, -2)" />
       <path className="leaf" d="M28 10 C 30 14, 30 20, 28 24 Q 26 20, 24 22 C 26 17, 26 13, 28 10 Z" transform="scale(0.7) translate(15, 0)" />
       <path className="leaf" d="M-8 10 C -10 14, -10 20, -8 24 Q -6 20, -4 22 C -6 17, -6 13, -8 10 Z" transform="scale(0.7) translate(-15, 0)" />
    </g>
    {/* Text "Rees" */}
    <text x="10" y="75" className="logo-text">
      Rees
    </text>
    {/* Swirl */}
     <path
      d="M 115,78 C 150,85 180,75 195,65 C 170,85 130,95 100,85"
      stroke="hsl(25, 88%, 55%)"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
     />
      <path
       d="M 0,68 C 10,95 50,90 80,75"
       stroke="hsl(25, 88%, 55%)"
       strokeWidth="3"
       fill="none"
       strokeLinecap="round"
       transform="translate(5,0)"
     />
  </svg>
);
