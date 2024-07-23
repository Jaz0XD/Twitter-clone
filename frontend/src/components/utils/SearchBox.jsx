import { PiMagnifyingGlass } from "react-icons/pi"; // Ensure this import is correct

const SearchInput = () => {
    return (
        <div className='group'>
            <label className="input rounded-full flex items-center gap-x-2 bg-[#16181C] focus-within:border-primary focus:outline-none">
                <PiMagnifyingGlass className='size-6 text-gray-500 group-focus-within:text-primary mr-4' /> 
                <input type="text" className="grow text-gray-500 text-lg " placeholder="Search" />
            </label>
        </div>
    );
};

export default SearchInput;
