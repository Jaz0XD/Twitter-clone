// import SearchBox from '../utils/SearchBox'
// import Premium from '../utils/Premium'
// import News from '../utils/News'
// import RecommendedUsers from '../user/RecommendedUsers'

// const RightPanel = () => {
//     return (
//         <div className='hidden md:block pt-4 pl-8 border-l border-gray-700'>
//             <div className='sticky top-0 left-0 bg-black p-6 z-20'>
//                 <SearchBox />
//             </div>
//             <div className='z-0 h-screen sticky top-0 left-0 mb-20'>
//                 <Premium />
//                 <News />
//                 <RecommendedUsers />
//             </div>
//         </div>
//     )
// }

// export default RightPanel;

import SearchBox from "../utils/SearchBox";
// import Premium from "../utils/Premium";
import News from "../utils/News";
import RecommendedUsers from "../user/RecommendedUsers";

const RightPanel = () => {
  return (
    <div className="hidden md:block pt-4 pl-8 border-l border-gray-700">
      <div className="sticky top-0 left-0 bg-black p-6 z-20">
        <SearchBox />
      </div>
      <div className="z-0 h-screen sticky top-0 left-0 mb-20">
        {/* <Premium /> */}
        <RecommendedUsers />
        <News />
      </div>
    </div>
  );
};

export default RightPanel;
