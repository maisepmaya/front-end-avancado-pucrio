import SheetBar from "../components/SheetBar";
import ImgDiv from "../components/ImgDiv";
import SquareButton from "../components/SquareButton";
import { XIcon } from "@phosphor-icons/react";

const Home = () => {
  return (
    <div className="flex flex-row size-full">
      <SheetBar />
      <div className="w-full m-4 relative">
        <Grid />
      </div>
    </div>
  );
};

const Grid = () => {
  const teste = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return (
    <div className="absolute  inset-0 overflow-y-auto overflow-x-hidden mx-0 my-auto grid gap-2 grid-cols-1 md:grid-cosl-2 lg:grid-cols-3 xl:grid-cols-4">
      {teste.map((i) => (
        <Card index={i} />
      ))}
    </div>
  );
};

const Card = ({ index }) => {
  const card = {
    name: "teste teste teste",
    level: 0,
    ac: 15,
    currLife: 20,
    index: 0,
    info: "aaa",
  };

  const handleDeleteCard = () => {};

  const handleChangeLife = (text) => {
    console.log(text);
  };

  const heart = {
    full: "./src/assets/full-heart.png",
    medium: "./src/assets/heart.png",
    low: "./src/assets/btoke-heart.png",
  };

  return (
    <ImgDiv src="./src/assets/card-base.png" className="aspect-[12/8] m-2">
      <div className="relative size-full flex flex-col items-center">
        {/* Close Button */}

        <SquareButton
          type="exit"
          className="absolute w-7 right-0 aspect-square transition-transform hover:scale-110 active:scale-100 z-10"
          onClick={handleDeleteCard}
        />

        {/* Header */}
        <div className="absolute -top-2 left-0 right-0 h-[18%] flex items-center justify-center">
          <ImgDiv
            src="./src/assets/card-title.png"
            className={"w-[55%] h-full"}
          >
            <div className="size-full relative gap-1 px-4 flex items-center justify-evenly rotate-[3deg]">
              <p className="font-bold text-[15px] text-[#2c1609] mt-1 truncate ">
                {card.name}
              </p>
              <p className="bg-[#2c1609] text-[#e7d5b3] font-bold text-sm px-2 py-1 rounded h-[20px] flex items-center justify-center">
                {card.level}
              </p>
            </div>
          </ImgDiv>
        </div>

        {/* Middle Section */}
        <div className="mt-6 w-[75 %] h-[60%] gap-1 flex justify-evenly items-center ">
          {/* Life Controls*/}
          <div className="flex flex-col items-center justify-center  items-center gap-1 h-[70%]">
            <SquareButton
              type="plus"
              className="h-[35%] aspect-square  transition-transform hover:scale-110 active:scale-95"
              onClick={() => handleChange()}
            />
            <input
              type="number"
              className="w-13 h-[30%] text-center bg-[#75523f] text-xl font-bold text-[#f1dad6] appearance-none"
              defaultValue={1}
            />
            <SquareButton
              type="minus"
              className="h-[35%] aspect-square   transition-transform hover:scale-110 active:scale-95"
              onClick={() => handleChange()}
            />
          </div>

          {/* Life */}

          <div className="aspect-square h-[70%] max-h-[150px]">
            <ImgDiv src={heart.medium} className={"size-full"}>
              <div className="size-full flex items-center justify-center">
                <input
                  type="number"
                  className="text-[25px] size-full font-bold text-center text-[#f1dad6]"
                  onBlur={() => handleChange()}
                  value={card.currLife}
                />
              </div>
            </ImgDiv>
          </div>

          {/* AC Display */}
          <div className="aspect-square h-[40%] mt-6">
            <ImgDiv src={"./src/assets/shield.png"} className={"size-full"}>
              <div className="size-full pt-3 flex items-center justify-center">
                {card.ac}
              </div>
            </ImgDiv>
          </div>
        </div>

        {/* Info Container */}
        <div className="absolute h-[40%] justify-end -bottom-2 left-0 -right-4 flex  ">
          <ImgDiv src="./src/assets/card-tag.png" className={"w-[85%] h-full"}>
            {/* Info Container */}
            <div className="flex size-full  p-4 w-[70%] flex-col px-1 rotate-[-2deg]">
              <p className="text-[#75523f] text-sm font-bold">Informações:</p>
              <textarea
                className="cursor-text text-xs size-full font-normal font-[Marhey,sans-serif] text-[#75523f] bg-transparent resize-none p-1 rotate-[1deg] cursor-default placeholder-[#b88263] overflow-auto"
                spellCheck="false"
                onBlur={() => handleChange()}
                placeholder="Nada para mostrar..."
                defaultValue={card.info ?? ""}
              ></textarea>
            </div>
          </ImgDiv>
        </div>
      </div>
    </ImgDiv>
  );
};

export default Home;

//  {/* Close Button */}
//   <button
//     onClick={handleDeleteCard}
//     className="absolute right-[10px] top-[15px] w-[35px] aspect-square bg-[url('/img/exit.png')] bg-cover transition-transform hover:scale-110 active:scale-100 z-10"
//   ></button>

//   {/* Middle Section */}
//   <div className="relative z-10 flex h-[110px] w-full justify-center">
//     {/* Life Control */}
//     <div className="relative flex justify-center w-48 text-2xl">
//       <div className="absolute bottom-[3px] left-2 flex flex-col items-center gap-1 w-10">
//         <SquareButton
//           type="plus"
//           className="w-7 aspect-square  transition-transform hover:scale-110 active:scale-100"
//           onClick={() => handleChange()}
//         />
//         <input
//           type="number"
//           className="w-10 text-center bg-[#75523f] text-xl font-bold text-[#f1dad6] appearance-none"
//           defaultValue={1}
//         />
//         <SquareButton
//           type="minus"
//           className="w-7 aspect-square   transition-transform hover:scale-110 active:scale-100"
//           onClick={() => handleChange()}
//         />
//       </div>

//       <ImgDiv src={"./src/assets/heart.png"}>
//         <div className="size-8 flex">
//           <input
//             type="number"
//             className="text-[35px] font-bold text-center text-[#f1dad6] p-2"
//             onBlur={() => handleChange()}
//             value={card.currLife}
//           />
//         </div>
//       </ImgDiv>

//       <button
//         className="absolute bottom-[5px] left-[55px] w-7 aspect-square bg-[#75523f] bg-[url('/img/magic-wand.svg')] bg-cover transition-transform hover:scale-110 active:scale-100"
//         onClick={() => handleChange()}
//       ></button>
//     </div>

//     {/* Index */}
//     <div className="absolute left-[3px] bottom-[30px] text-[#e7d5b3] text-lg z-20 text-center w-[29px]">
//       {card.index}
//     </div>

//     {/* AC Display */}
//     <div className="absolute right-[60px] bottom-[25px] flex justify-center">
//       <p className="text-[#e7d5b3] text-lg w-[50px] text-center">
//         {card.ac}
//       </p>
//     </div>
//   </div>

//   {/* Info Container */}
//   <div className="flex flex-col px-1 rotate-[-3deg]">
//     <p className="text-[#75523f] text-sm font-bold">Informações:</p>
//     <textarea
//       className="w-[165px] h-[50px] text-[10px] font-normal font-[Marhey,sans-serif] text-[#75523f] bg-transparent resize-none p-1 rotate-[1deg] cursor-default placeholder-[#b88263] overflow-auto"
//       spellCheck="false"
//       onBlur={() => handleChange()}
//       placeholder="Nada para mostrar..."
//       defaultValue={card.info ?? ""}
//     ></textarea>
//   </div>
