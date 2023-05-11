import React from 'react'

export function Footer() {
  return (
    <footer className="bg-gray-800 py-8 max-h-48 z-15 rounded-t-lg overflow-y-auto scroll-smooth">
  <div className="container mx-auto px-11">
    <div className="flex flex-wrap justify-between">
      <div className="w-full lg:w-1/4 mb-0 lg:mb-0">
        <h2 className="text-white cursor-default select-none text-lg font-bold mb-4">About Us</h2>
        <p className="text-gray-400 cursor-default select-none">All rights reserved. Everything you see here has been a result of the time and effors I have put in to the Software Engineering discipline at Flatiron School. Incredible things happen here. </p>
      </div>
      
      <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
        <h2 className="text-white cursor-default select-none text-lg font-bold mb-4">Contact Us</h2>
        <p className="text-gray-400 cursor-default select-none"><i className="fas fa-map-marker-alt"></i> 123 Main Street<br/>Anytown, USA 12345</p>
        <p className="text-gray-400"><i className="fas fa-envelope cursor-default select-none"></i> info@example.com</p>
        <p className="text-gray-400"><i className="fas fa-phone cursor-default select-none"></i> (123) 456-7890</p>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-4 mt-4">
      <p className="text-gray-400 text-sm text-center cursor-default select-none">&copy; 2023 My Website. All Rights Reserved.</p>
    </div>
  </div>
</footer>
  )
}
