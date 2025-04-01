"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search, Filter, Star, MapPin, Globe, Clock } from "lucide-react";
import { API_BASE_URL } from "@/config/axiosInstance";
import { searchTutors, getAllTutors } from "@/services/tutorService";
import { Link } from "react-router-dom";

export default function TutorList() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTeachingMode, setSelectedTeachingMode] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);

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
        PageSize: 20,
      };

      const response = await getAllTutors(pagination);
      setTutors(response.data || []);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle subject input change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectsInput = e.target.value;
    // Split by comma and trim each subject
    const subjectList = subjectsInput
      .split(",")
      .map((subject) => subject.trim())
      .filter((subject) => subject !== "");
    setSelectedSubjects(subjectList);
  };

  // Handle search with all criteria
  const handleSearch = async () => {
    setLoading(true);
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
        MaxFee: priceRange[1] < 100 ? priceRange[1] : undefined,
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
        PageSize: 20,
      };

      const response = await searchTutors(searchCriteria, pagination);
      setTutors(response.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Find a Tutor</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="h-5 w-5 mr-2" />
          {showFilters ? "Hide Advanced Search" : "Show Advanced Search"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Subjects
              </label>
              <input
                type="text"
                placeholder="Enter subjects, separated by commas"
                value={selectedSubjects.join(",")}
                onChange={handleSubjectChange}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {subjectSuggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1 dark:text-gray-300">
                    Available subjects:
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
                        +{subjectSuggestions.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Teaching Mode
              </label>
              <select
                value={selectedTeachingMode}
                onChange={(e) => setSelectedTeachingMode(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Minimum Experience (years)
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
                Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const min = Number(e.target.value);
                    setPriceRange([min, Math.max(min + 10, priceRange[1])]);
                  }}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const max = Number(e.target.value);
                    setPriceRange([Math.min(priceRange[0], max - 10), max]);
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Minimum Rating: {minRating}
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
        )}

        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Tutor List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">No tutors found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={
                  tutor?.profileImage
                    ? `${API_BASE_URL}/${
                        tutor.profileImage
                      }?t=${new Date().getTime()}`
                    : "/placeholder.svg?height=96&width=96"
                }
                alt={tutor.tutorName}
                className="h-24 w-24 rounded-full object-cover self-center md:self-start"
              />

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold">{tutor.tutorName}</h3>
                  <div className="flex items-center mt-2 md:mt-0">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">
                        {tutor.rating || "N/A"}
                      </span>
                    </div>
                    <span className="font-bold text-blue-500">
                      ${tutor.feeRange?.minFee || 0} - $
                      {tutor.feeRange?.maxFee || 0}/hr
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 mb-3 gap-y-1">
                  {tutor.location && (
                    <div className="flex items-center mr-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{tutor.location}</span>
                    </div>
                  )}
                  {tutor.teachingMode && (
                    <div className="flex items-center mr-4">
                      <Globe className="h-4 w-4 mr-1" />
                      <span>{tutor.teachingMode}</span>
                    </div>
                  )}
                  {tutor.experience && (
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{tutor.experience || 0} years experience</span>
                    </div>
                  )}
                </div>

                {tutor.subjects && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tutor.subjects
                      .split(",")
                      .map((subject: string) => subject.trim())
                      .map((subject: string, index: number) => {
                        const colors = [
                          "bg-red-100 text-red-800",
                          "bg-green-100 text-green-800",
                          "bg-blue-100 text-blue-800",
                          "bg-yellow-100 text-yellow-800",
                          "bg-purple-100 text-purple-800",
                          "bg-pink-100 text-pink-800",
                          "bg-orange-100 text-orange-800",
                          "bg-teal-100 text-teal-800",
                        ];

                        const colorClass = colors[index % colors.length];

                        return (
                          <span
                            key={subject}
                            className={`px-2 py-1 text-sm rounded-md ${colorClass}`}
                          >
                            {subject}
                          </span>
                        );
                      })}
                  </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {tutor.introduction || "No introduction provided."}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-0">
                    {tutor.school && (
                      <span className="text-sm">
                        <span className="font-medium">School:</span>{" "}
                        {tutor.school}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/tutor/${tutor.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View Profile
                    </Link>
                    {/* <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Book Session
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
