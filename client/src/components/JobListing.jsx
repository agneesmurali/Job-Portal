import React,{useContext, useEffect} from 'react'
import { AppContext } from '../context/AppContext.jsx'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard.jsx'
import { useState } from 'react'
const JobListing = () => {
    const {isSearched, searchFilter,setSearchFilter,jobs} = useContext(AppContext)

    const [showFilter,setShowFilter] = useState(false)
    const [currentPage,setCurrentPage] = useState(1)
    const[selectedCategory,setSelectedCategory] = useState([])
    const [selectedLocation,setSelectedLocation] = useState([])

    const[filteredJobs,setFilteredJobs] = useState(jobs)
    const handleCategoryChange = (category) => {
        setSelectedCategory(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };
     const handleLocationChange = (location) => {
        setSelectedLocation(prev => 
            prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        );
    };
    useEffect(()=>{
        const matchsCategory=job=>selectedCategory.length===0||selectedCategory.includes(job.category)
        const matchesLocation=job=>selectedLocation.length===0||selectedLocation.includes(job.location)
        const matchsTitle=job=>searchFilter.title===""|| job.title.toLowerCase().includes(searchFilter.title.toLowerCase())
        const matchSearchLocation=job=>searchFilter.location===""||job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
        const newFilteredJobs=jobs.slice().reverse().filter(
            job=>matchsCategory(job) && matchesLocation(job)&& matchsTitle(job)&&matchSearchLocation(job)
        )
        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    },[jobs,selectedCategory,selectedLocation,searchFilter])
  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8'>
        {/*SideBar*/ }
        <div className='w-full lg:w-1/4 bg-white px-4'>
            {/* Search Filter From Hero Component*/}
            {
                isSearched &&(searchFilter.title !=="" || searchFilter.location !=="") &&(
                    <>
                    <h3 className='font-medium text-lg mb-4'>Current Search</h3>
                    <div className='mb-4 text-gray-600'>
                        {searchFilter.title &&(
                            <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                                {searchFilter.title}
                                <img onClick={e=>setSearchFilter(prev=>({...prev,title:""}))} src={assets.cross_icon} alt='cross icon' className='cursor-pointer'/>
                            </span>
                        )}
                        {searchFilter.location &&(
                            <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                                {searchFilter.location}
                                  <img onClick={e=>setSearchFilter(prev=>({...prev,location:""}))} src={assets.cross_icon} alt='cross icon' className='cursor-pointer'/>
                            </span>
                        )}
                    </div>
                    </>
                )
            }
            <button onClick={e=>setShowFilter(prev=>!prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
                {showFilter ?"Close":"Filters"}
            </button>
            {/* Job Categories Filter */}
            <div className={showFilter ?"":"max-lg:hidden"}>
                <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
                <ul className='space-y-4 text-gray-600'>
                    {
                        JobCategories.map((category, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' type="checkbox"onChange={(e)=>handleCategoryChange(category)} checked={selectedCategory.includes(category)} />
                                {category} 
                            </li>
                        ))
                    }
                </ul>
            </div>
             {/* Job Location Filter */}
            <div className={showFilter ?"":"max-lg:hidden"}>
                <h4 className='font-medium text-lg py-4 pt-14'>Search by Location</h4>
                <ul className='space-y-4 text-gray-600'>
                    {
                        JobLocations.map((location, index) => (
                            <li className='flex gap-3 items-center' key={index}>
                                <input className='scale-125' type="checkbox" onChange={(e)=>handleLocationChange(location)} checked={selectedLocation.includes(location)} />
                                {location} 
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
        {/* Job Listings */}
        <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
            <h3 className='font-medium text-3xl py-2' id='job-list'>Lastest Job</h3>
            <p className='mb-8'>Get your desired job from top companies</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
                    {filteredJobs.slice((currentPage-1)*6,currentPage*6).map((job, index) => (
                        <JobCard  key={index} job={job}/>
                    ))}
            </div>
            {/*Pagination Section*/ }
            {filteredJobs.length > 0 && (
                <div className='flex items-center justify-center space-x-2 mt-10'>
                    <a href="#job-list">
                        <img onClick={()=>setCurrentPage(Math.max(currentPage-1,1))} src={assets.left_arrow_icon}alt=''/>
                    </a>
                    {Array.from({ length: Math.ceil(filteredJobs.length / 6)}).map((_,index)=>(
                        <a href="#job-list" key={index}>
                            <button onClick={()=>setCurrentPage(index+1)}className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${currentPage===index+1?'bg-blue-100 text-blue-500':'text-gray-500'}`}>{index + 1}</button>

                        </a>
                    ))}
                       <a href="#job-list">
                        <img onClick={()=>setCurrentPage(Math.min(currentPage+1,Math.ceil(filteredJobs.length/6)))} src={assets.right_arrow_icon}alt=''/>
                    </a>
                </div>
            )}
        </section>
    </div>
  )
}

export default JobListing