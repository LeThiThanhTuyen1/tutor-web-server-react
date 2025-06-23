import type React from "react";

interface AdvancedFiltersProps {
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  subjectSuggestions: string[];
  selectedTeachingMode: string;
  setSelectedTeachingMode: (mode: string) => void;
  minExperience: string;
  setMinExperience: (value: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  selectedSubjects,
  setSelectedSubjects,
  subjectSuggestions,
  selectedTeachingMode,
  setSelectedTeachingMode,
  minExperience,
  setMinExperience,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
}) => {
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectsInput = e.target.value;
    const subjectList = subjectsInput
      .split(",")
      .map((subject) => subject.trim())
      .filter((subject) => subject !== "");
    setSelectedSubjects(subjectList);
  };

  const handleMinPriceChange = (value: number) => {
    const min = Math.min(value, priceRange[1] - 1);
    setPriceRange([min, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: number) => {
    const max = Math.max(value, priceRange[0] + 1);
    setPriceRange([priceRange[0], max]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Môn học
        </label>
        <input
          type="text"
          placeholder="Nhập các môn học, cách nhau bằng dấu phẩy"
          value={selectedSubjects.join(", ")}
          onChange={handleSubjectChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {subjectSuggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1 dark:text-gray-300">
              Môn học khả dụng:
            </p>
            <div className="flex flex-wrap gap-1 pt-2">
              {subjectSuggestions.slice(0, 8).map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    if (!selectedSubjects.includes(subject)) {
                      setSelectedSubjects([...selectedSubjects, subject]);
                    }
                  }}
                  className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  {subject}
                </button>
              ))}
              {subjectSuggestions.length > 8 && (
                <span className="text-xs px-2 py-1 text-gray-500">
                  +{subjectSuggestions.length - 8} môn khác
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Hình thức giảng dạy
        </label>
        <select
          value={selectedTeachingMode}
          onChange={(e) => setSelectedTeachingMode(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Tất cả</option>
          <option value="Online">Trực tuyến</option>
          <option value="Offline">Trực tiếp</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Kinh nghiệm tối thiểu (năm)
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Khoảng học phí (đồng/giờ)
        </label>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Học phí tối thiểu
              </span>
              <span className="text-sm font-medium">{priceRange[0]} đồng</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="9999999"
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max={priceRange[1] - 1}
                value={priceRange[0]}
                onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                className="w-20 p-1 text-sm border rounded-md"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Học phí tối đa
              </span>
              <span className="text-sm font-medium">{priceRange[1]} đồng</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={priceRange[0] + 1}
                max="10000000"
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min={priceRange[0] + 1}
                max="10000000"
                value={priceRange[1]}
                onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                className="w-20 p-1 text-sm border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Điểm đánh giá tối thiểu: {minRating}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;