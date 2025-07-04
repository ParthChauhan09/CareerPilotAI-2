/**
 * Format success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 */
exports.success = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    // Check if we're dealing with a resume, cover letter, or LinkedIn bio
    const url = res.req.originalUrl;

    if (url.includes("/resume") && data.resume) {
      response.resume = data.resume;
      // Also add to data for consistency
      response.data = data.resume;
    } else if (url.includes("/cover-letter") && data.coverLetter) {
      response.coverLetter = data.coverLetter;
      // Also add to data for consistency
      response.data = data.coverLetter;
    } else if (url.includes("/linkedin") && data.linkedinBio) {
      response.linkedinBio = data.linkedinBio;
      // Also add to data for consistency
      response.data = data.linkedinBio;
    } else {
      // Default case
      response.data = data;
    }

    console.log(`Success response for URL ${url}:`, response);
  }

  return res.status(statusCode).json(response);
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
exports.error = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

/**
 * Format pagination response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Success message
 */
exports.pagination = (
  res,
  data,
  page,
  limit,
  total,
  message = "Data retrieved successfully"
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Determine the appropriate key based on the URL path
  let dataKey = "data";
  const url = res.req.originalUrl;

  if (url.includes("/resume")) {
    dataKey = "resumes";
  } else if (url.includes("/cover-letter")) {
    dataKey = "coverLetters";
  } else if (url.includes("/linkedin")) {
    dataKey = "linkedinBios";
  }

  console.log(`Using data key '${dataKey}' for URL: ${url}`);

  // Create response object with the appropriate data key
  const responseObj = {
    success: true,
    message,
    pagination: {
      total,
      limit,
      page,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    },
  };

  // Set the data with the appropriate key
  responseObj[dataKey] = data;

  // Always include data field for consistency
  responseObj.data = data;

  console.log(`Pagination response for URL ${url}:`, {
    success: responseObj.success,
    message: responseObj.message,
    pagination: responseObj.pagination,
    dataKeys: Object.keys(responseObj).filter(
      (k) => k !== "success" && k !== "message" && k !== "pagination"
    ),
  });

  return res.status(200).json(responseObj);
};
