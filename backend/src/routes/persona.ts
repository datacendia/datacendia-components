// =============================================================================
// CENDIA PERSONA FORGE™ API ROUTES
// Digital Twin Management
// =============================================================================

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /persona/twins - List digital twins
router.get('/twins', async (req: Request, res: Response) => {
  try {
    const orgId = req.query.organization_id as string;
    const twins = await prisma.persona_twins.findMany({
      where: orgId ? { organization_id: orgId } : {},
      include: { conversations: { take: 5, orderBy: { created_at: 'desc' } } }
    });
    res.json({ success: true, data: twins });
  } catch (error) {
    console.error('[Persona] Twins error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch twins' });
  }
});

// GET /persona/twins/:id - Get single twin
router.get('/twins/:id', async (req: Request, res: Response) => {
  try {
    const twin = await prisma.persona_twins.findUnique({
      where: { id: req.params.id },
      include: { conversations: { take: 10, orderBy: { created_at: 'desc' } } }
    });
    if (!twin) return res.status(404).json({ success: false, error: 'Twin not found' });
    res.json({ success: true, data: twin });
  } catch (error) {
    console.error('[Persona] Twin error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch twin' });
  }
});

// POST /persona/twins - Create twin
router.post('/twins', async (req: Request, res: Response) => {
  try {
    const twin = await prisma.persona_twins.create({
      data: {
        organization_id: req.body.organization_id,
        name: req.body.name,
        role: req.body.role,
        department: req.body.department,
        personality_config: req.body.personality_config || {},
        knowledge_domains: req.body.knowledge_domains || []
      }
    });
    res.json({ success: true, data: twin });
  } catch (error) {
    console.error('[Persona] Create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create twin' });
  }
});

// POST /persona/twins/:id/conversation - Add conversation
router.post('/twins/:id/conversation', async (req: Request, res: Response) => {
  try {
    const conversation = await prisma.persona_conversations.create({
      data: {
        twin_id: req.params.id,
        user_id: req.body.user_id,
        messages: req.body.messages || [],
        satisfaction: req.body.satisfaction,
        duration_ms: req.body.duration_ms
      }
    });
    
    // Update twin interaction count
    await prisma.persona_twins.update({
      where: { id: req.params.id },
      data: { interactions: { increment: 1 } }
    });
    
    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('[Persona] Conversation error:', error);
    res.status(500).json({ success: false, error: 'Failed to create conversation' });
  }
});

export default router;
