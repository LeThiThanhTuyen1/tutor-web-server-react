import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Filter } from "lucide-react";
import { searchTutors, getAllTutors } from "@/services/tutorService";
import { useRating } from "@/context/rating-context";
import useSpeechToText from "@/hook/use-speech-to-text";
import SearchBar from "@/components/ui/search-bar-tutor";
import AdvancedFilters from "@/components/ui/advanced-filter";
import TutorCard from "./tutor-card";
import type React from "react";

const TutorList: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTeachingMode, setSelectedTeachingMode] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { tutorRatings, refreshRating } = useRating();

  const { isListening, startListening, stopListening, cleanTranscript, reset } =
    useSpeechToText({ continuous: true, lang: "vi-VN", interimResults: false });

  const user = useSelector((state: any) => state.auth.user);
  console.log(user?.id);

  const startStopListening = () => {
    isListening ? stopListening() : startListening();
  };

  useEffect(() => {
    if (cleanTranscript) {
      setLocation(cleanTranscript);
    }
  }, [cleanTranscript]);
  
  // Fetch tutors on component mount
  useEffect(() => {
    fetchTutors();
  }, []);

  // Extract unique subjects from tutors for suggestions
  useEffect(() => {
    if (tutors.length > 0) {
      const allSubjects = new Set<string>();
      tutors.forEach((tutor) => {
        if (tutor.subjects) {
          tutor.subjects.split(",").forEach((subject: string) => {
            allSubjects.add(subject.trim());
          });
        }
      });
      setSubjectSuggestions(Array.from(allSubjects));
    }
  }, [tutors]);

  // Fetch all tutors from API
  const fetchTutors = async () => {
    try {
      const pagination = {
        PageNumber: 1,
        PageSize: 6,
      };

      const response = await getAllTutors(pagination);
      const tutorsData = response.data || [];
      setTutors(tutorsData);

      // Refresh ratings for tutors in batches to avoid performance issues
      const batchSize = 3;
      for (let i = 0; i < tutorsData.length; i += batchSize) {
        const batch = tutorsData.slice(i, i + batchSize);
        await Promise.all(
          batch.map((tutor: any) => tutor.id && refreshRating(tutor.id))
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách gia sư:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setLocation("");
    setSelectedSubjects([]);
    setSelectedTeachingMode("");
    setMinExperience("");
    setPriceRange([0, 10000000]);
    setMinRating(0);
    setTutors([]);
    setErrorMessage("");
    reset();
    fetchTutors();
  };

  // Handle search with all criteria
  const handleSearch = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      // Validate inputs
      const minExp = minExperience
        ? Number.parseFloat(minExperience)
        : undefined;
      const minRate = minRating > 0 ? minRating : undefined;

      // Create search criteria object
      const searchCriteria = {
        Subjects: selectedSubjects.join(","),
        Location: location,
        TeachingMode: selectedTeachingMode,
        MinFee: priceRange[0] > 0 ? priceRange[0] : undefined,
        MaxFee: priceRange[1] < 10000000 ? priceRange[1] : undefined,
        MinExperience: minExp,
        MinRating: minRate,
      };

      // Remove undefined values
      Object.keys(searchCriteria).forEach((key) => {
        if (searchCriteria[key as keyof typeof searchCriteria] === undefined) {
          delete searchCriteria[key as keyof typeof searchCriteria];
        }
      });

      const pagination = {
        PageNumber: 1,
        PageSize: 6,
      };

      const response = await searchTutors(searchCriteria, pagination);
      if (!response.succeeded) {
        setErrorMessage(response.message || "Không tìm thấy gia sư nào.");
        setTutors([]);
      } else {
        const tutorsData = response.data || [];

        // Refresh ratings for all tutors in search results
        for (const tutor of tutorsData) {
          if (tutor.id) {
            await refreshRating(tutor.id);
          }
        }

        setTutors(tutorsData);
      }
    } catch (error) {
      console.error("Tìm kiếm thất bại:", error);
      setErrorMessage("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Get rating from context if available, otherwise use local state
  const getTutorRating = (tutor: any) => {
    return tutorRatings[tutor.id] !== undefined
      ? tutorRatings[tutor.id]
      : typeof tutor.rating === "number"
      ? tutor.rating
      : 0;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Tìm gia sư</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? "Ẩn tìm kiếm nâng cao" : "Hiển thị tìm kiếm nâng cao"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <SearchBar
          location={location}
          setLocation={setLocation}
          isListening={isListening}
          transcript={cleanTranscript}
          startStopListening={startStopListening}
          resetTranscript={reset}
        />

        {showFilters && (
          <AdvancedFilters
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
            subjectSuggestions={subjectSuggestions}
            selectedTeachingMode={selectedTeachingMode}
            setSelectedTeachingMode={setSelectedTeachingMode}
            minExperience={minExperience}
            setMinExperience={setMinExperience}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
          />
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSearch}
            disabled={isListening} // Disable khi đang nghe
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isListening
                ? "bg-blue-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Tìm kiếm
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Đặt lại
          </button>
          <button
            onClick={startStopListening}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            {isListening ? "Dừng" : "Nói"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : errorMessage ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{errorMessage}</p>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy gia sư
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Hãy thử điều chỉnh tiêu chí tìm kiếm
            </p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              tutorRating={getTutorRating(tutor)}
              userImage={
                user && (tutor.userId === user.id || tutor.email === user.email)
                  ? user.image
                  : undefined
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TutorList;
