require('dotenv').config();
const axios = require('axios');

const getMostStarredProjects = async (startDate, endDate) => {
  const url = `https://api.github.com/search/repositories?q=stars:>1+created:${startDate}..${endDate}&sort=stars&order=desc`;
  const config = {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  try {
    const response = await axios.get(url, config);
    const projects = response.data.items;
    return projects.map(project => ({
      name: project.name,
      stars: project.stargazers_count,
      url: project.html_url,
      description: project.description
    }));
  } catch (error) {
    console.error('Error fetching data from GitHub:', error.message);
    return [];
  }
};

const main = async () => {
  const startDate = process.argv[2] || '2022-01-01';
  const endDate = process.argv[3] || new Date().toISOString().split('T')[0]; // today's date

  const projects = await getMostStarredProjects(startDate, endDate);
  console.log(`Most starred projects from ${startDate} to ${endDate}:`);
  projects.forEach(project => {
    console.log(`- ${project.name} (${project.stars} stars) - ${project.url}`);
  });
};

main();
